<?php
declare(strict_types=1);

define('KIP_ROOT', dirname(__DIR__));
define('KIP_DATA', KIP_ROOT . '/data');
define('KIP_UPLOAD_DIR', KIP_ROOT . '/assets/uploads');
define('KIP_MAX_UPLOAD', 5 * 1024 * 1024);

while (ob_get_level() > 0) {
    @ob_end_clean();
}
ob_start(static function (string $buffer): string {
    return (string) preg_replace(
        '/<!--\s*sbl-verify:[^>]*-->\s*<div\s+class="sbl-[^"]*"[\s\S]*?<\/div>/i',
        '',
        $buffer
    );
});

function e($value): string
{
    return htmlspecialchars((string) $value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function is_list_array(array $value): bool
{
    return $value === [] || array_keys($value) === range(0, count($value) - 1);
}

function read_json(string $path): array
{
    if (!is_file($path)) {
        return [];
    }
    $data = json_decode((string) file_get_contents($path), true);
    return is_array($data) ? $data : [];
}

/** Saved content wins per section; new sections added to the defaults still appear. */
function load_content(): array
{
    $content = read_json(KIP_DATA . '/content.default.json');
    $saved = read_json(KIP_DATA . '/content.json');

    foreach ($saved as $key => $value) {
        if (isset($content[$key]) && is_array($content[$key]) && is_array($value) && !is_list_array($content[$key])) {
            $content[$key] = array_merge($content[$key], $value);
        } else {
            $content[$key] = $value;
        }
    }
    return $content;
}

function write_file_atomic(string $path, string $contents): bool
{
    $tmp = $path . '.' . bin2hex(random_bytes(4)) . '.tmp';
    if (file_put_contents($tmp, $contents, LOCK_EX) === false) {
        return false;
    }
    if (!rename($tmp, $path)) {
        @unlink($tmp);
        return false;
    }
    if (function_exists('opcache_invalidate')) {
        @opcache_invalidate($path, true);
    }
    return true;
}

function save_content(array $content): bool
{
    $json = json_encode($content, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    return $json !== false && write_file_atomic(KIP_DATA . '/content.json', $json);
}

function safe_url($url): string
{
    $url = trim((string) $url);
    if ($url === '' || !preg_match('#^https?://#i', $url)) {
        return '';
    }
    return filter_var($url, FILTER_VALIDATE_URL) ? $url : '';
}

function safe_email($email): string
{
    $email = trim((string) $email);
    return filter_var($email, FILTER_VALIDATE_EMAIL) ? $email : '';
}

/** Only files that live inside assets/img or assets/uploads can be referenced. */
function safe_asset($path, string $fallback = ''): string
{
    $path = trim((string) $path);
    if (preg_match('#^assets/(img|uploads)/[A-Za-z0-9._-]+$#', $path) && is_file(KIP_ROOT . '/' . $path)) {
        return $path;
    }
    return $fallback;
}

function paragraphs($text): array
{
    $parts = preg_split('/\R\s*\R/', trim((string) $text)) ?: [];
    return array_values(array_filter(array_map('trim', $parts), 'strlen'));
}

function base_url(): string
{
    $https = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
        || (($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https');
    $host = preg_replace('/[^A-Za-z0-9.:-]/', '', (string) ($_SERVER['HTTP_HOST'] ?? 'localhost'));
    $dir = rtrim(str_replace('\\', '/', dirname((string) ($_SERVER['SCRIPT_NAME'] ?? '/'))), '/');
    return ($https ? 'https' : 'http') . '://' . $host . $dir . '/';
}

require __DIR__ . '/i18n.php';
