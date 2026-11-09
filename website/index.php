<?php
declare(strict_types=1);
require __DIR__ . '/includes/bootstrap.php';

$lang = detect_locale();
$locales = kip_locales();
$c = load_page_content($lang);
$ui = $c['ui'];
$site = $c['site'];
$show = $c['sections'];
$hero = $c['hero'];
$apple = safe_url($c['stores']['apple_url'] ?? '');
$google = safe_url($c['stores']['google_url'] ?? '');
$contact = $c['contact'];
$email = safe_email($contact['email'] ?? '');
$telegram = safe_url($contact['telegram'] ?? '');
$x = safe_url($contact['x'] ?? '');
$company = $site['company_name'] !== '' ? $site['company_name'] : 'kip';
$base = base_url();

$nav = array_filter([
    'how' => $ui['nav_how'],
    'features' => $ui['nav_features'],
    'screens' => $ui['nav_screens'],
    'about' => $ui['nav_about'],
    'faq' => $ui['nav_faq'],
], static function ($key) use ($show) {
    return !empty($show[$key]);
}, ARRAY_FILTER_USE_KEY);

function store_badges(string $apple, string $google, array $ui): void
{
    $stores = [
        ['apple', $apple, $ui['download_on'], $ui['app_store']],
        ['googleplay', $google, $ui['get_it_on'], $ui['google_play']],
    ];
    echo '<div class="badges">';
    foreach ($stores as [$icon, $url, $small, $name]) {
        $inner = '<span class="badge-icon badge-icon--' . $icon . '" aria-hidden="true"></span>'
            . '<span class="badge-text"><small>' . e($url !== '' ? $small : $ui['coming_soon']) . '</small>'
            . '<strong>' . e($name) . '</strong></span>';
        if ($url !== '') {
            echo '<a class="badge" href="' . e($url) . '" target="_blank" rel="noopener">' . $inner . '</a>';
        } else {
            echo '<span class="badge is-soon" aria-disabled="true">' . $inner . '</span>';
        }
    }
    echo '</div>';
}

header('Content-Type: text/html; charset=utf-8');
?>
<!doctype html>
<html lang="<?= e($locales[$lang]['html']) ?>">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title><?= e($site['title']) ?></title>
  <meta name="description" content="<?= e($site['description']) ?>">
  <meta name="theme-color" content="#0b0f19">
  <meta property="og:type" content="website">
  <meta property="og:title" content="<?= e($site['title']) ?>">
  <meta property="og:description" content="<?= e($site['description']) ?>">
  <meta property="og:image" content="<?= e($base) ?>assets/img/kip-icon-1024.png">
  <meta name="twitter:card" content="summary">
  <link rel="icon" href="assets/img/kip-icon.svg" type="image/svg+xml">
  <link rel="apple-touch-icon" href="assets/img/apple-touch-icon.png">
  <?php foreach ($locales as $code => $meta): ?>
  <link rel="alternate" hreflang="<?= e($meta['html']) ?>" href="<?= e($base) ?>?lang=<?= e($code) ?>">
  <?php endforeach; ?>
  <link rel="alternate" hreflang="x-default" href="<?= e($base) ?>">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="<?= e(locale_font_href($lang)) ?>">
  <link rel="stylesheet" href="assets/css/site.css?v=2">
  <script>document.documentElement.classList.add('js')</script>
</head>
<body>
  <a class="skip-link" href="#main"><?= e($ui['skip']) ?></a>

  <header class="site-header">
    <div class="container header-row">
      <a class="brand" href="#top" aria-label="<?= e($ui['home']) ?>">
        <img src="assets/img/kip-icon.svg" alt="" width="32" height="32">
        <span>kip</span>
      </a>
      <nav id="site-menu" class="site-nav" aria-label="Main">
        <?php foreach ($nav as $id => $label): ?>
          <a href="#<?= $id ?>"><?= e($label) ?></a>
        <?php endforeach; ?>
      </nav>
      <div class="header-actions">
        <details class="lang-switch" data-lang-switch>
          <summary aria-label="<?= e($ui['language']) ?>">
            <span><?= e(strtoupper($lang)) ?></span>
          </summary>
          <ul>
            <?php foreach ($locales as $code => $meta): ?>
              <li>
                <a href="<?= e(locale_url($code)) ?>" hreflang="<?= e($meta['html']) ?>" lang="<?= e($meta['html']) ?>"<?= $code === $lang ? ' aria-current="true"' : '' ?>>
                  <span class="lang-code"><?= e(strtoupper($code)) ?></span>
                  <span><?= e($meta['native']) ?></span>
                </a>
              </li>
            <?php endforeach; ?>
          </ul>
        </details>
        <a class="btn btn-gold btn-sm" href="#download"><?= e($ui['download']) ?></a>
        <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="site-menu" data-menu-toggle data-open-label="<?= e($ui['open_menu']) ?>" data-close-label="<?= e($ui['close_menu']) ?>">
          <span class="sr-only"><?= e($ui['open_menu']) ?></span>
          <span class="menu-bars" aria-hidden="true"></span>
        </button>
      </div>
    </div>
  </header>

  <main id="main">
    <section id="top" class="hero">
      <div class="container hero-grid">
        <div class="hero-copy">
          <p class="eyebrow" data-reveal><?= e($hero['eyebrow']) ?></p>
          <h1 class="hero-title" data-reveal style="--d:1"><?= e($hero['title']) ?></h1>
          <p class="hero-sub" data-reveal style="--d:2"><?= e($hero['subtitle']) ?></p>
          <div data-reveal style="--d:3"><?php store_badges($apple, $google, $ui); ?></div>
        </div>

        <div class="tap-stage" data-reveal style="--d:2" aria-hidden="true">
          <div class="phone phone-left">
            <img src="<?= e(safe_asset($hero['image_left'], 'assets/img/screen-pay.png')) ?>" alt="" width="414" height="868">
          </div>
          <div class="tap-point">
            <span class="ring"></span>
            <span class="ring" style="animation-delay:.4s"></span>
            <span class="ring" style="animation-delay:.8s"></span>
          </div>
          <div class="phone phone-right">
            <img src="<?= e(safe_asset($hero['image_right'], 'assets/img/screen-get.png')) ?>" alt="" width="414" height="868">
          </div>
        </div>
      </div>
    </section>

    <?php if (!empty($show['how']) && !empty($c['how']['steps'])): ?>
    <section id="how" class="section">
      <div class="container">
        <div class="section-head" data-reveal>
          <h2><?= e($c['how']['title']) ?></h2>
          <p><?= e($c['how']['subtitle']) ?></p>
        </div>
        <ol class="steps">
          <?php foreach ($c['how']['steps'] as $i => $step): ?>
            <li class="step" data-reveal style="--d:<?= $i ?>">
              <span class="step-num"><?= $i + 1 ?></span>
              <h3><?= e($step['title']) ?></h3>
              <p><?= e($step['text']) ?></p>
            </li>
          <?php endforeach; ?>
        </ol>
      </div>
    </section>
    <?php endif; ?>

    <?php if (!empty($show['features']) && !empty($c['features']['items'])): ?>
    <section id="features" class="section">
      <div class="container">
        <div class="section-head" data-reveal>
          <h2><?= e($c['features']['title']) ?></h2>
          <p><?= e($c['features']['subtitle']) ?></p>
        </div>
        <div class="features">
          <?php foreach ($c['features']['items'] as $i => $feature): ?>
            <article class="feature" data-reveal style="--d:<?= $i % 2 ?>">
              <h3><?= e($feature['title']) ?></h3>
              <p><?= e($feature['text']) ?></p>
            </article>
          <?php endforeach; ?>
        </div>
      </div>
    </section>
    <?php endif; ?>

    <?php if (!empty($show['screens']) && !empty($c['screens']['items'])): ?>
    <section id="screens" class="section">
      <div class="container">
        <div class="section-head" data-reveal>
          <h2><?= e($c['screens']['title']) ?></h2>
          <p><?= e($c['screens']['subtitle']) ?></p>
        </div>
      </div>
      <div class="screens-track" tabindex="0" aria-label="<?= e($ui['screens_aria']) ?>">
        <?php foreach ($c['screens']['items'] as $i => $screen):
            $src = safe_asset($screen['image']);
            if ($src === '') continue; ?>
          <figure class="screen" data-reveal style="--d:<?= min($i, 4) ?>">
            <img src="<?= e($src) ?>" alt="<?= e($screen['caption'] !== '' ? $screen['caption'] : $ui['screen_alt']) ?>" width="414" height="868" loading="lazy">
            <figcaption><?= e($screen['caption']) ?></figcaption>
          </figure>
        <?php endforeach; ?>
      </div>
    </section>
    <?php endif; ?>

    <?php if (!empty($show['about'])): ?>
    <section id="about" class="section">
      <div class="container about-grid">
        <div data-reveal>
          <p class="eyebrow"><?= e($c['about']['title']) ?></p>
          <h2 class="about-heading"><?= e($c['about']['heading']) ?></h2>
        </div>
        <div class="about-text" data-reveal style="--d:1">
          <?php foreach (paragraphs($c['about']['text']) as $paragraph): ?>
            <p><?= nl2br(e($paragraph)) ?></p>
          <?php endforeach; ?>
        </div>
      </div>
    </section>
    <?php endif; ?>

    <?php if (!empty($show['faq']) && !empty($c['faq']['items'])): ?>
    <section id="faq" class="section">
      <div class="container faq-wrap">
        <div class="section-head" data-reveal>
          <h2><?= e($c['faq']['title']) ?></h2>
        </div>
        <div class="faq">
          <?php foreach ($c['faq']['items'] as $item): ?>
            <details class="faq-item" data-reveal>
              <summary><?= e($item['question']) ?></summary>
              <p><?= nl2br(e($item['answer'])) ?></p>
            </details>
          <?php endforeach; ?>
        </div>
      </div>
    </section>
    <?php endif; ?>

    <section id="download" class="section">
      <div class="container">
        <div class="download" data-reveal>
          <img class="download-mark" src="assets/img/kip-icon.svg" alt="" width="88" height="88">
          <h2><?= e($c['download']['title']) ?></h2>
          <p><?= e($c['download']['text']) ?></p>
          <?php store_badges($apple, $google, $ui); ?>
        </div>
      </div>
    </section>
  </main>

  <footer class="site-footer">
    <div class="container footer-grid">
      <div class="footer-brand">
        <a class="brand" href="#top">
          <img src="assets/img/kip-icon.svg" alt="" width="28" height="28">
          <span>kip</span>
        </a>
        <?php if ($contact['note'] !== ''): ?>
          <p><?= e($contact['note']) ?></p>
        <?php endif; ?>
      </div>
      <address class="footer-contact">
        <?php if ($email !== ''): ?>
          <a href="mailto:<?= e($email) ?>"><?= e($email) ?></a>
        <?php endif; ?>
        <?php if ($telegram !== ''): ?>
          <a href="<?= e($telegram) ?>" target="_blank" rel="noopener"><?= e($ui['telegram']) ?></a>
        <?php endif; ?>
        <?php if ($x !== ''): ?>
          <a href="<?= e($x) ?>" target="_blank" rel="noopener"><?= e($ui['twitter']) ?></a>
        <?php endif; ?>
        <?php if ($contact['address'] !== ''): ?>
          <span><?= nl2br(e($contact['address'])) ?></span>
        <?php endif; ?>
      </address>
    </div>
    <div class="container footer-base">
      <span>&copy; <?= date('Y') ?> <?= e($company) ?>. <?= e($ui['rights']) ?></span>
    </div>
  </footer>

  <script src="assets/js/site.js?v=2" defer></script>
</body>
</html>
