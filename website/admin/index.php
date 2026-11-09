<?php
declare(strict_types=1);
require __DIR__ . '/../includes/bootstrap.php';
require __DIR__ . '/../includes/admin.php';

start_admin_session();
header('Content-Type: text/html; charset=utf-8');
header('X-Frame-Options: DENY');
header('Cache-Control: no-store');
header('X-Robots-Tag: noindex, nofollow');

$admin = load_admin();
$error = null;
$flash = $_SESSION['flash'] ?? null;
unset($_SESSION['flash']);

function redirect_with(string $message): void
{
    $_SESSION['flash'] = $message;
    header('Location: index.php');
    exit;
}

$dataWritable = is_writable(KIP_DATA);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = (string) ($_POST['action'] ?? '');

    if (!verify_csrf()) {
        $error = 'Your session expired. Please try again.';
    } elseif ($action === 'setup' && $admin === null) {
        $username = post_text($_POST, 'username', 40);
        $password = (string) ($_POST['password'] ?? '');
        if (!preg_match('/^[A-Za-z0-9_.-]{3,40}$/', $username)) {
            $error = 'Username must be 3–40 letters, numbers, dots, dashes or underscores.';
        } elseif (strlen($password) < 10) {
            $error = 'Password must be at least 10 characters.';
        } elseif ($password !== (string) ($_POST['confirm'] ?? '')) {
            $error = 'The two passwords do not match.';
        } elseif (!$dataWritable || !save_admin($username, $password)) {
            $error = 'Could not save the account. Make the data folder writable (permission 755 or 775).';
        } else {
            log_in();
            redirect_with('Account created. Welcome to the control panel.');
        }
    } elseif ($action === 'login' && $admin !== null) {
        $username = post_text($_POST, 'username', 40);
        $password = (string) ($_POST['password'] ?? '');
        if (is_locked_out()) {
            $error = 'Too many attempts. Wait 15 minutes and try again.';
        } elseif (hash_equals($admin['username'], $username) && password_verify($password, $admin['hash'])) {
            clear_failed_logins();
            log_in();
            header('Location: index.php');
            exit;
        } else {
            record_failed_login();
            usleep(400000);
            $error = 'Wrong username or password.';
        }
    } elseif (is_logged_in()) {
        if ($action === 'save') {
            try {
                $editLang = (string) ($_POST['edit_lang'] ?? 'en');
                if (!kip_is_locale($editLang)) {
                    $editLang = kip_default_locale();
                }
                if (!save_locale_content($editLang, content_from_post($_POST, load_page_content($editLang)))) {
                    throw new RuntimeException('Could not write data/content.json. Check folder permissions.');
                }
                $_SESSION['flash'] = 'Changes published. Your website is updated.';
                header('Location: index.php?lang=' . rawurlencode($editLang));
                exit;
            } catch (RuntimeException $exception) {
                $error = $exception->getMessage();
            }
        } elseif ($action === 'password') {
            $currentPassword = (string) ($_POST['current'] ?? '');
            $newPassword = (string) ($_POST['password'] ?? '');
            if (!password_verify($currentPassword, $admin['hash'])) {
                $error = 'Current password is not correct.';
            } elseif (strlen($newPassword) < 10) {
                $error = 'New password must be at least 10 characters.';
            } elseif ($newPassword !== (string) ($_POST['confirm'] ?? '')) {
                $error = 'The two new passwords do not match.';
            } elseif (!save_admin($admin['username'], $newPassword)) {
                $error = 'Could not save the new password.';
            } else {
                redirect_with('Password changed.');
            }
        } elseif ($action === 'logout') {
            $_SESSION = [];
            session_destroy();
            header('Location: index.php');
            exit;
        }
    }
}

$loggedIn = $admin !== null && is_logged_in();
$token = csrf_token();
$editLang = isset($_GET['lang']) && is_string($_GET['lang']) && kip_is_locale($_GET['lang'])
    ? $_GET['lang']
    : kip_default_locale();
$c = $loggedIn ? load_page_content($editLang) : [];

function field_id(string $name): string
{
    return trim((string) preg_replace('/[^a-z0-9]+/i', '-', $name), '-');
}

function text_field(string $label, string $name, $value, string $type = 'text', string $hint = ''): void
{
    $id = field_id($name);
    echo '<div class="field"><label for="' . e($id) . '">' . e($label) . '</label>';
    echo '<input id="' . e($id) . '" type="' . e($type) . '" name="' . e($name) . '" value="' . e($value) . '">';
    if ($hint !== '') {
        echo '<p class="hint">' . e($hint) . '</p>';
    }
    echo '</div>';
}

function area_field(string $label, string $name, $value, int $rows = 3, string $hint = ''): void
{
    $id = field_id($name);
    echo '<div class="field"><label for="' . e($id) . '">' . e($label) . '</label>';
    echo '<textarea id="' . e($id) . '" name="' . e($name) . '" rows="' . $rows . '">' . e($value) . '</textarea>';
    if ($hint !== '') {
        echo '<p class="hint">' . e($hint) . '</p>';
    }
    echo '</div>';
}

function pair_row(string $base, $key, array $labels, array $row): void
{
    [$firstKey, $secondKey] = array_keys($labels);
    echo '<div class="repeat-item">';
    text_field($labels[$firstKey], $base . '[' . $key . '][' . $firstKey . ']', $row[$firstKey] ?? '');
    area_field($labels[$secondKey], $base . '[' . $key . '][' . $secondKey . ']', $row[$secondKey] ?? '', 3);
    echo '<button type="button" class="link-danger" data-remove>Remove</button></div>';
}

function screen_row($key, array $row): void
{
    $image = safe_asset($row['image'] ?? '');
    echo '<div class="repeat-item screen-item">';
    echo '<div class="thumb">' . ($image !== '' ? '<img src="../' . e($image) . '" alt="">' : '<span>New</span>') . '</div>';
    echo '<div class="screen-fields">';
    echo '<input type="hidden" name="screens[items][' . e($key) . '][image]" value="' . e($image) . '">';
    text_field('Caption', 'screens[items][' . $key . '][caption]', $row['caption'] ?? '');
    $id = field_id('screen_files_' . $key);
    echo '<div class="field"><label for="' . e($id) . '">' . ($image !== '' ? 'Replace image' : 'Image') . '</label>';
    echo '<input id="' . e($id) . '" type="file" name="screen_files[' . e($key) . ']" accept="image/png,image/jpeg,image/webp"></div>';
    echo '<button type="button" class="link-danger" data-remove>Remove</button></div></div>';
}

function repeat_block(string $name, string $addLabel, array $rows, callable $render): void
{
    echo '<div class="repeat" data-repeat="' . e($name) . '"><div class="repeat-items">';
    foreach ($rows as $key => $row) {
        $render($key, $row);
    }
    echo '</div><template>';
    $render('__INDEX__', []);
    echo '</template><button type="button" class="btn btn-ghost" data-add>' . e($addLabel) . '</button></div>';
}
?>
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex, nofollow">
  <title>kip control panel</title>
  <link rel="icon" href="../assets/img/kip-icon.svg" type="image/svg+xml">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500&display=swap">
  <link rel="stylesheet" href="admin.css?v=2">
</head>
<body>
<?php if (!$loggedIn): ?>
  <main class="auth">
    <form class="auth-card" method="post" autocomplete="on">
      <div class="auth-brand">
        <img src="../assets/img/kip-icon.svg" alt="" width="40" height="40">
        <span>kip <em>control panel</em></span>
      </div>
      <h1><?= $admin === null ? 'Create your admin account' : 'Sign in' ?></h1>
      <?php if ($admin === null): ?>
        <p class="muted">This is the first visit. Choose the username and password you will use to edit the website.</p>
        <?php if (!$dataWritable): ?>
          <p class="alert alert-error">The <code>data</code> folder is not writable. Set its permission to 755 (or 775) in your hosting file manager, then reload.</p>
        <?php endif; ?>
      <?php endif; ?>
      <?php if ($error): ?><p class="alert alert-error" role="alert"><?= e($error) ?></p><?php endif; ?>
      <?php if ($flash): ?><p class="alert alert-ok" role="status"><?= e($flash) ?></p><?php endif; ?>

      <input type="hidden" name="csrf" value="<?= e($token) ?>">
      <input type="hidden" name="action" value="<?= $admin === null ? 'setup' : 'login' ?>">
      <div class="field">
        <label for="username">Username</label>
        <input id="username" name="username" required autocomplete="username" autofocus>
      </div>
      <div class="field">
        <label for="password">Password</label>
        <input id="password" type="password" name="password" required minlength="<?= $admin === null ? 10 : 1 ?>"
               autocomplete="<?= $admin === null ? 'new-password' : 'current-password' ?>">
      </div>
      <?php if ($admin === null): ?>
        <div class="field">
          <label for="confirm">Repeat password</label>
          <input id="confirm" type="password" name="confirm" required minlength="10" autocomplete="new-password">
        </div>
      <?php endif; ?>
      <button class="btn btn-gold btn-block" type="submit"><?= $admin === null ? 'Create account' : 'Sign in' ?></button>
      <a class="back-link" href="../">Back to website</a>
    </form>
  </main>
<?php else: ?>
  <header class="topbar">
    <div class="topbar-row">
      <div class="auth-brand">
        <img src="../assets/img/kip-icon.svg" alt="" width="32" height="32">
        <span>kip <em>control panel</em></span>
      </div>
      <div class="topbar-actions">
        <a class="btn btn-ghost" href="../?lang=<?= e($editLang) ?>" target="_blank" rel="noopener">View website</a>
        <form method="post">
          <input type="hidden" name="csrf" value="<?= e($token) ?>">
          <input type="hidden" name="action" value="logout">
          <button class="btn btn-ghost" type="submit">Sign out</button>
        </form>
      </div>
    </div>
  </header>

  <div class="layout">
    <nav class="sidenav" aria-label="Panel sections">
      <a href="#p-general">General</a>
      <a href="#p-hero">Hero &amp; stores</a>
      <a href="#p-how">How it works</a>
      <a href="#p-features">Features</a>
      <a href="#p-screens">Screens</a>
      <a href="#p-about">About company</a>
      <a href="#p-faq">FAQ</a>
      <a href="#p-contact">Download &amp; contact</a>
      <a href="#p-account">Account</a>
    </nav>

    <main class="panel">
      <?php if ($error): ?><p class="alert alert-error" role="alert"><?= e($error) ?></p><?php endif; ?>
      <?php if ($flash): ?><p class="alert alert-ok" role="status"><?= e($flash) ?></p><?php endif; ?>

      <form method="post" enctype="multipart/form-data" class="editor">
        <input type="hidden" name="csrf" value="<?= e($token) ?>">
        <input type="hidden" name="action" value="save">
        <input type="hidden" name="edit_lang" value="<?= e($editLang) ?>">

        <section class="card">
          <h2>Language</h2>
          <p class="hint">Edit texts for one language at a time. Store links, images and visible sections stay the same for every language.</p>
          <div class="lang-tabs">
            <?php foreach (kip_locales() as $code => $meta): ?>
              <a class="lang-tab<?= $code === $editLang ? ' is-active' : '' ?>" href="index.php?lang=<?= e($code) ?>">
                <strong><?= e(strtoupper($code)) ?></strong>
                <span><?= e($meta['native']) ?></span>
              </a>
            <?php endforeach; ?>
          </div>
        </section>

        <section id="p-general" class="card">
          <h2>General</h2>
          <?php text_field('Company name', 'site[company_name]', $c['site']['company_name'], 'text', 'Shown in the About section and footer.'); ?>
          <?php text_field('Page title', 'site[title]', $c['site']['title'], 'text', 'Shown in the browser tab and Google results.'); ?>
          <?php area_field('Search description', 'site[description]', $c['site']['description'], 2); ?>
          <fieldset class="toggles">
            <legend>Visible sections</legend>
            <?php foreach (['how' => 'How it works', 'features' => 'Features', 'screens' => 'Screens', 'about' => 'About company', 'faq' => 'FAQ'] as $key => $label): ?>
              <label class="check">
                <input type="checkbox" name="sections[<?= $key ?>]" value="1" <?= !empty($c['sections'][$key]) ? 'checked' : '' ?>>
                <span><?= e($label) ?></span>
              </label>
            <?php endforeach; ?>
          </fieldset>
        </section>

        <section id="p-hero" class="card">
          <h2>Hero &amp; store links</h2>
          <?php text_field('Small label', 'hero[eyebrow]', $c['hero']['eyebrow']); ?>
          <?php text_field('Headline', 'hero[title]', $c['hero']['title']); ?>
          <?php area_field('Intro text', 'hero[subtitle]', $c['hero']['subtitle'], 3); ?>
          <div class="grid-2">
            <?php foreach (['left' => 'Left phone image', 'right' => 'Right phone image'] as $side => $label):
                $img = safe_asset($c['hero']['image_' . $side]); ?>
              <div class="image-field">
                <div class="thumb"><?php if ($img !== ''): ?><img src="../<?= e($img) ?>" alt=""><?php endif; ?></div>
                <input type="hidden" name="hero[image_<?= $side ?>]" value="<?= e($img) ?>">
                <div class="field">
                  <label for="hero_<?= $side ?>_file"><?= e($label) ?></label>
                  <input id="hero_<?= $side ?>_file" type="file" name="hero_<?= $side ?>_file" accept="image/png,image/jpeg,image/webp">
                </div>
              </div>
            <?php endforeach; ?>
          </div>
          <?php text_field('Apple App Store link', 'stores[apple_url]', $c['stores']['apple_url'], 'url', 'Leave empty to show "Coming soon".'); ?>
          <?php text_field('Google Play link', 'stores[google_url]', $c['stores']['google_url'], 'url', 'Leave empty to show "Coming soon".'); ?>
        </section>

        <section id="p-how" class="card">
          <h2>How it works</h2>
          <?php text_field('Title', 'how[title]', $c['how']['title']); ?>
          <?php area_field('Subtitle', 'how[subtitle]', $c['how']['subtitle'], 2); ?>
          <h3>Steps</h3>
          <?php repeat_block('steps', 'Add step', $c['how']['steps'], static function ($key, array $row) {
              pair_row('how[steps]', $key, ['title' => 'Step title', 'text' => 'Step text'], $row);
          }); ?>
        </section>

        <section id="p-features" class="card">
          <h2>Features</h2>
          <?php text_field('Title', 'features[title]', $c['features']['title']); ?>
          <?php area_field('Subtitle', 'features[subtitle]', $c['features']['subtitle'], 2); ?>
          <h3>Feature list</h3>
          <?php repeat_block('features', 'Add feature', $c['features']['items'], static function ($key, array $row) {
              pair_row('features[items]', $key, ['title' => 'Feature title', 'text' => 'Description'], $row);
          }); ?>
        </section>

        <section id="p-screens" class="card">
          <h2>Wallet screens</h2>
          <?php text_field('Title', 'screens[title]', $c['screens']['title']); ?>
          <?php area_field('Subtitle', 'screens[subtitle]', $c['screens']['subtitle'], 2); ?>
          <h3>Screenshots</h3>
          <p class="hint">PNG, JPG or WebP, up to 5 MB. Tall phone screenshots work best.</p>
          <?php repeat_block('screens', 'Add screenshot', $c['screens']['items'], 'screen_row'); ?>
        </section>

        <section id="p-about" class="card">
          <h2>About company</h2>
          <?php text_field('Small label', 'about[title]', $c['about']['title']); ?>
          <?php text_field('Heading', 'about[heading]', $c['about']['heading']); ?>
          <?php area_field('Text', 'about[text]', $c['about']['text'], 9, 'Leave an empty line between paragraphs.'); ?>
        </section>

        <section id="p-faq" class="card">
          <h2>FAQ</h2>
          <?php text_field('Title', 'faq[title]', $c['faq']['title']); ?>
          <?php repeat_block('faq', 'Add question', $c['faq']['items'], static function ($key, array $row) {
              pair_row('faq[items]', $key, ['question' => 'Question', 'answer' => 'Answer'], $row);
          }); ?>
        </section>

        <section id="p-contact" class="card">
          <h2>Download &amp; contact</h2>
          <?php text_field('Download title', 'download[title]', $c['download']['title']); ?>
          <?php area_field('Download text', 'download[text]', $c['download']['text'], 2); ?>
          <div class="grid-2">
            <?php text_field('Email', 'contact[email]', $c['contact']['email'], 'email'); ?>
            <?php text_field('Telegram link', 'contact[telegram]', $c['contact']['telegram'], 'url'); ?>
            <?php text_field('X (Twitter) link', 'contact[x]', $c['contact']['x'], 'url'); ?>
            <?php text_field('Address', 'contact[address]', $c['contact']['address']); ?>
          </div>
          <?php area_field('Footer note', 'contact[note]', $c['contact']['note'], 2); ?>
        </section>

        <div class="savebar">
          <span class="muted">Changes go live as soon as you publish.</span>
          <button class="btn btn-gold" type="submit">Publish changes</button>
        </div>
      </form>

      <section id="p-account" class="card">
        <h2>Account</h2>
        <p class="muted">Signed in as <strong><?= e($admin['username']) ?></strong>.</p>
        <form method="post" class="grid-3">
          <input type="hidden" name="csrf" value="<?= e($token) ?>">
          <input type="hidden" name="action" value="password">
          <div class="field">
            <label for="current">Current password</label>
            <input id="current" type="password" name="current" required autocomplete="current-password">
          </div>
          <div class="field">
            <label for="new-password">New password</label>
            <input id="new-password" type="password" name="password" required minlength="10" autocomplete="new-password">
          </div>
          <div class="field">
            <label for="new-confirm">Repeat new password</label>
            <input id="new-confirm" type="password" name="confirm" required minlength="10" autocomplete="new-password">
          </div>
          <button class="btn btn-ghost" type="submit">Change password</button>
        </form>
      </section>
    </main>
  </div>
  <script src="admin.js?v=1" defer></script>
<?php endif; ?>
</body>
</html>
