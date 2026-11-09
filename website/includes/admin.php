<?php
declare(strict_types=1);

define('KIP_ADMIN_FILE', KIP_DATA . '/admin.php');
define('KIP_ATTEMPTS_FILE', KIP_DATA . '/login-attempts.php');
define('KIP_MAX_ATTEMPTS', 5);
define('KIP_LOCKOUT_SECONDS', 900);
define('KIP_SESSION_SECONDS', 7200);

/** Stored as PHP so the file prints nothing even on servers that ignore .htaccess. */
function write_php_array(string $path, array $data): bool
{
    return write_file_atomic($path, "<?php\nreturn " . var_export($data, true) . ";\n");
}

function read_php_array(string $path): array
{
    if (!is_file($path)) {
        return [];
    }
    $data = include $path;
    return is_array($data) ? $data : [];
}

function load_admin(): ?array
{
    $admin = read_php_array(KIP_ADMIN_FILE);
    return isset($admin['username'], $admin['hash']) ? $admin : null;
}

function save_admin(string $username, string $password): bool
{
    return write_php_array(KIP_ADMIN_FILE, [
        'username' => $username,
        'hash' => password_hash($password, PASSWORD_DEFAULT),
    ]);
}

function start_admin_session(): void
{
    if (session_status() === PHP_SESSION_ACTIVE) {
        return;
    }
    $secure = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
        || (($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https');
    session_name('kip_admin');
    session_set_cookie_params([
        'lifetime' => 0,
        'path' => '/',
        'secure' => $secure,
        'httponly' => true,
        'samesite' => 'Strict',
    ]);
    session_start();
}

function csrf_token(): string
{
    if (empty($_SESSION['csrf'])) {
        $_SESSION['csrf'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf'];
}

function verify_csrf(): bool
{
    $sent = $_POST['csrf'] ?? '';
    return is_string($sent) && !empty($_SESSION['csrf']) && hash_equals($_SESSION['csrf'], $sent);
}

function is_logged_in(): bool
{
    if (empty($_SESSION['admin']) || time() - (int) ($_SESSION['seen'] ?? 0) > KIP_SESSION_SECONDS) {
        return false;
    }
    $_SESSION['seen'] = time();
    return true;
}

function log_in(): void
{
    session_regenerate_id(true);
    $_SESSION['admin'] = true;
    $_SESSION['seen'] = time();
}

function client_key(): string
{
    return hash('sha256', (string) ($_SERVER['REMOTE_ADDR'] ?? 'unknown'));
}

function is_locked_out(): bool
{
    $row = read_php_array(KIP_ATTEMPTS_FILE)[client_key()] ?? null;
    return is_array($row) && $row['count'] >= KIP_MAX_ATTEMPTS && time() - $row['time'] < KIP_LOCKOUT_SECONDS;
}

function record_failed_login(): void
{
    $now = time();
    $attempts = array_filter(
        read_php_array(KIP_ATTEMPTS_FILE),
        static function ($row) use ($now) {
            return is_array($row) && $now - $row['time'] < KIP_LOCKOUT_SECONDS;
        }
    );
    $key = client_key();
    $attempts[$key] = ['count' => ($attempts[$key]['count'] ?? 0) + 1, 'time' => $now];
    write_php_array(KIP_ATTEMPTS_FILE, $attempts);
}

function clear_failed_logins(): void
{
    $attempts = read_php_array(KIP_ATTEMPTS_FILE);
    unset($attempts[client_key()]);
    write_php_array(KIP_ATTEMPTS_FILE, $attempts);
}

function clip(string $value, int $max): string
{
    return function_exists('mb_substr') ? mb_substr($value, 0, $max, 'UTF-8') : substr($value, 0, $max);
}

function post_text($source, string $key, int $max = 600): string
{
    $value = is_array($source) ? ($source[$key] ?? '') : '';
    if (!is_string($value)) {
        return '';
    }
    return clip(trim(str_replace("\r\n", "\n", $value)), $max);
}

/** Returns the new asset path, or null when no file was chosen. */
function store_upload($tmp, int $error, int $size): ?string
{
    if ($error === UPLOAD_ERR_NO_FILE) {
        return null;
    }
    if ($error !== UPLOAD_ERR_OK) {
        throw new RuntimeException('An image upload failed (error ' . $error . '). Try a smaller file.');
    }
    if ($size > KIP_MAX_UPLOAD) {
        throw new RuntimeException('Images must be 5 MB or smaller.');
    }
    if (!is_string($tmp) || !is_uploaded_file($tmp)) {
        throw new RuntimeException('The uploaded file could not be read.');
    }
    $types = [IMAGETYPE_PNG => 'png', IMAGETYPE_JPEG => 'jpg', IMAGETYPE_WEBP => 'webp'];
    $info = @getimagesize($tmp);
    if (!$info || !isset($types[$info[2]])) {
        throw new RuntimeException('Images must be PNG, JPG or WebP.');
    }
    if (!is_dir(KIP_UPLOAD_DIR) || !is_writable(KIP_UPLOAD_DIR)) {
        throw new RuntimeException('The assets/uploads folder is not writable on the server.');
    }
    $name = bin2hex(random_bytes(8)) . '.' . $types[$info[2]];
    if (!move_uploaded_file($tmp, KIP_UPLOAD_DIR . '/' . $name)) {
        throw new RuntimeException('The image could not be saved.');
    }
    return 'assets/uploads/' . $name;
}

function uploaded_image(string $field, $key = null): ?string
{
    if (!isset($_FILES[$field]) || !is_array($_FILES[$field])) {
        return null;
    }
    $file = $_FILES[$field];
    if ($key === null) {
        return is_array($file['error']) ? null : store_upload($file['tmp_name'], (int) $file['error'], (int) $file['size']);
    }
    if (!is_array($file['error']) || !isset($file['error'][$key])) {
        return null;
    }
    return store_upload($file['tmp_name'][$key], (int) $file['error'][$key], (int) $file['size'][$key]);
}

function post_rows($rows, array $fields, int $limit = 12): array
{
    $result = [];
    foreach (is_array($rows) ? $rows : [] as $row) {
        $item = [];
        foreach ($fields as $field => $max) {
            $item[$field] = post_text($row, $field, $max);
        }
        if (implode('', $item) !== '') {
            $result[] = $item;
        }
        if (count($result) >= $limit) {
            break;
        }
    }
    return $result;
}

function content_from_post(array $post, array $current): array
{
    $section = static function (string $key) use ($post): array {
        return isset($post[$key]) && is_array($post[$key]) ? $post[$key] : [];
    };
    $site = $section('site');
    $hero = $section('hero');
    $stores = $section('stores');
    $how = $section('how');
    $features = $section('features');
    $screens = $section('screens');
    $about = $section('about');
    $faq = $section('faq');
    $download = $section('download');
    $contact = $section('contact');
    $visible = $section('sections');

    $screenItems = [];
    foreach (is_array($screens['items'] ?? null) ? $screens['items'] : [] as $key => $row) {
        $image = uploaded_image('screen_files', $key) ?? safe_asset($row['image'] ?? '');
        if ($image === '') {
            continue;
        }
        $screenItems[] = ['image' => $image, 'caption' => post_text($row, 'caption', 80)];
        if (count($screenItems) >= 12) {
            break;
        }
    }

    $sectionFlags = [];
    foreach (array_keys($current['sections'] ?? []) as $name) {
        $sectionFlags[$name] = !empty($visible[$name]);
    }

    return [
        'site' => [
            'company_name' => post_text($site, 'company_name', 80),
            'title' => post_text($site, 'title', 120),
            'description' => post_text($site, 'description', 300),
        ],
        'sections' => $sectionFlags,
        'hero' => [
            'eyebrow' => post_text($hero, 'eyebrow', 80),
            'title' => post_text($hero, 'title', 140),
            'subtitle' => post_text($hero, 'subtitle', 400),
            'image_left' => uploaded_image('hero_left_file')
                ?? safe_asset($hero['image_left'] ?? '', $current['hero']['image_left'] ?? ''),
            'image_right' => uploaded_image('hero_right_file')
                ?? safe_asset($hero['image_right'] ?? '', $current['hero']['image_right'] ?? ''),
        ],
        'stores' => [
            'apple_url' => safe_url($stores['apple_url'] ?? ''),
            'google_url' => safe_url($stores['google_url'] ?? ''),
        ],
        'how' => [
            'title' => post_text($how, 'title', 120),
            'subtitle' => post_text($how, 'subtitle', 300),
            'steps' => post_rows($how['steps'] ?? [], ['title' => 80, 'text' => 300], 6),
        ],
        'features' => [
            'title' => post_text($features, 'title', 120),
            'subtitle' => post_text($features, 'subtitle', 300),
            'items' => post_rows($features['items'] ?? [], ['title' => 80, 'text' => 300], 8),
        ],
        'screens' => [
            'title' => post_text($screens, 'title', 120),
            'subtitle' => post_text($screens, 'subtitle', 300),
            'items' => $screenItems,
        ],
        'about' => [
            'title' => post_text($about, 'title', 60),
            'heading' => post_text($about, 'heading', 160),
            'text' => post_text($about, 'text', 3000),
        ],
        'faq' => [
            'title' => post_text($faq, 'title', 120),
            'items' => post_rows($faq['items'] ?? [], ['question' => 160, 'answer' => 800], 16),
        ],
        'download' => [
            'title' => post_text($download, 'title', 120),
            'text' => post_text($download, 'text', 300),
        ],
        'contact' => [
            'email' => safe_email($contact['email'] ?? ''),
            'address' => post_text($contact, 'address', 200),
            'telegram' => safe_url($contact['telegram'] ?? ''),
            'x' => safe_url($contact['x'] ?? ''),
            'note' => post_text($contact, 'note', 300),
        ],
    ];
}
