<?php
declare(strict_types=1);

function kip_locales(): array
{
    return [
        'en' => ['name' => 'English', 'native' => 'English', 'html' => 'en'],
        'ka' => ['name' => 'Georgian', 'native' => 'ქართული', 'html' => 'ka'],
        'ru' => ['name' => 'Russian', 'native' => 'Русский', 'html' => 'ru'],
        'az' => ['name' => 'Azerbaijani', 'native' => 'Azərbaycan', 'html' => 'az'],
        'hy' => ['name' => 'Armenian', 'native' => 'Հայերեն', 'html' => 'hy'],
        'tr' => ['name' => 'Turkish', 'native' => 'Türkçe', 'html' => 'tr'],
        'nl' => ['name' => 'Dutch', 'native' => 'Nederlands', 'html' => 'nl'],
        'es' => ['name' => 'Spanish', 'native' => 'Español', 'html' => 'es'],
        'it' => ['name' => 'Italian', 'native' => 'Italiano', 'html' => 'it'],
        'fr' => ['name' => 'French', 'native' => 'Français', 'html' => 'fr'],
    ];
}

function kip_default_locale(): string
{
    return 'en';
}

function kip_is_locale(string $code): bool
{
    return isset(kip_locales()[$code]);
}

function kip_ui_defaults(): array
{
    return [
        'nav_how' => 'How it works',
        'nav_features' => 'Features',
        'nav_screens' => 'Screens',
        'nav_about' => 'About',
        'nav_faq' => 'FAQ',
        'download' => 'Download',
        'skip' => 'Skip to content',
        'open_menu' => 'Open menu',
        'close_menu' => 'Close menu',
        'coming_soon' => 'Coming soon to',
        'download_on' => 'Download on the',
        'get_it_on' => 'Get it on',
        'app_store' => 'App Store',
        'google_play' => 'Google Play',
        'screens_aria' => 'App screens, scroll sideways',
        'screen_alt' => 'kip app screen',
        'telegram' => 'Telegram',
        'twitter' => 'X (Twitter)',
        'rights' => 'All rights reserved.',
        'language' => 'Language',
        'home' => 'kip home',
    ];
}

function locale_cookie_secure(): bool
{
    return (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
        || (($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https');
}

function set_locale_cookie(string $lang): void
{
    setcookie('kip_lang', $lang, [
        'expires' => time() + 60 * 60 * 24 * 365,
        'path' => '/',
        'secure' => locale_cookie_secure(),
        'httponly' => false,
        'samesite' => 'Lax',
    ]);
    $_COOKIE['kip_lang'] = $lang;
}

function detect_locale(): string
{
    $requested = isset($_GET['lang']) && is_string($_GET['lang']) ? strtolower($_GET['lang']) : '';
    if (kip_is_locale($requested)) {
        set_locale_cookie($requested);
        return $requested;
    }

    $cookie = $_COOKIE['kip_lang'] ?? '';
    if (is_string($cookie) && kip_is_locale($cookie)) {
        return $cookie;
    }

    return kip_default_locale();
}

function locale_url(string $lang): string
{
    $path = (string) (parse_url((string) ($_SERVER['REQUEST_URI'] ?? '/'), PHP_URL_PATH) ?: '/');
    return $path . '?lang=' . rawurlencode($lang);
}

function load_locale_file(string $lang): array
{
    if (!kip_is_locale($lang)) {
        return [];
    }
    return read_json(KIP_DATA . '/locales/' . $lang . '.json');
}

function load_locale_overrides(string $lang): array
{
    if ($lang === kip_default_locale()) {
        return [];
    }
    return read_json(KIP_DATA . '/content.' . $lang . '.json');
}

function overlay_text_fields(array $base, array $overlay): array
{
    $pairs = [
        ['site', ['title', 'description']],
        ['hero', ['eyebrow', 'title', 'subtitle']],
        ['how', ['title', 'subtitle']],
        ['features', ['title', 'subtitle']],
        ['screens', ['title', 'subtitle']],
        ['about', ['title', 'heading', 'text']],
        ['faq', ['title']],
        ['download', ['title', 'text']],
        ['contact', ['note']],
    ];

    foreach ($pairs as [$section, $keys]) {
        if (!isset($overlay[$section]) || !is_array($overlay[$section])) {
            continue;
        }
        foreach ($keys as $key) {
            $value = $overlay[$section][$key] ?? null;
            if (is_string($value) && $value !== '') {
                $base[$section][$key] = $value;
            }
        }
    }

    $lists = [
        ['how', 'steps', ['title', 'text']],
        ['features', 'items', ['title', 'text']],
        ['faq', 'items', ['question', 'answer']],
    ];
    foreach ($lists as [$section, $listKey, $fields]) {
        $rows = $overlay[$section][$listKey] ?? null;
        if (!is_array($rows) || !isset($base[$section][$listKey]) || !is_array($base[$section][$listKey])) {
            continue;
        }
        foreach ($base[$section][$listKey] as $i => $row) {
            if (!isset($rows[$i]) || !is_array($rows[$i])) {
                continue;
            }
            foreach ($fields as $field) {
                $value = $rows[$i][$field] ?? null;
                if (is_string($value) && $value !== '') {
                    $base[$section][$listKey][$i][$field] = $value;
                }
            }
        }
    }

    $captions = $overlay['screens']['items'] ?? null;
    if (is_array($captions) && isset($base['screens']['items']) && is_array($base['screens']['items'])) {
        foreach ($base['screens']['items'] as $i => $row) {
            $caption = '';
            if (isset($captions[$i]) && is_array($captions[$i])) {
                $caption = (string) ($captions[$i]['caption'] ?? '');
            } elseif (isset($captions[$i]) && is_string($captions[$i])) {
                $caption = $captions[$i];
            }
            if ($caption !== '') {
                $base['screens']['items'][$i]['caption'] = $caption;
            }
        }
    }

    if (isset($overlay['ui']) && is_array($overlay['ui'])) {
        $base['ui'] = array_merge(is_array($base['ui'] ?? null) ? $base['ui'] : [], $overlay['ui']);
    }

    return $base;
}

function extract_locale_payload(array $content): array
{
    $payload = [
        'ui' => is_array($content['ui'] ?? null) ? $content['ui'] : [],
        'site' => [
            'title' => (string) ($content['site']['title'] ?? ''),
            'description' => (string) ($content['site']['description'] ?? ''),
        ],
        'hero' => [
            'eyebrow' => (string) ($content['hero']['eyebrow'] ?? ''),
            'title' => (string) ($content['hero']['title'] ?? ''),
            'subtitle' => (string) ($content['hero']['subtitle'] ?? ''),
        ],
        'how' => [
            'title' => (string) ($content['how']['title'] ?? ''),
            'subtitle' => (string) ($content['how']['subtitle'] ?? ''),
            'steps' => [],
        ],
        'features' => [
            'title' => (string) ($content['features']['title'] ?? ''),
            'subtitle' => (string) ($content['features']['subtitle'] ?? ''),
            'items' => [],
        ],
        'screens' => [
            'title' => (string) ($content['screens']['title'] ?? ''),
            'subtitle' => (string) ($content['screens']['subtitle'] ?? ''),
            'items' => [],
        ],
        'about' => [
            'title' => (string) ($content['about']['title'] ?? ''),
            'heading' => (string) ($content['about']['heading'] ?? ''),
            'text' => (string) ($content['about']['text'] ?? ''),
        ],
        'faq' => [
            'title' => (string) ($content['faq']['title'] ?? ''),
            'items' => [],
        ],
        'download' => [
            'title' => (string) ($content['download']['title'] ?? ''),
            'text' => (string) ($content['download']['text'] ?? ''),
        ],
        'contact' => [
            'note' => (string) ($content['contact']['note'] ?? ''),
        ],
    ];

    foreach (is_array($content['how']['steps'] ?? null) ? $content['how']['steps'] : [] as $row) {
        $payload['how']['steps'][] = [
            'title' => (string) ($row['title'] ?? ''),
            'text' => (string) ($row['text'] ?? ''),
        ];
    }
    foreach (is_array($content['features']['items'] ?? null) ? $content['features']['items'] : [] as $row) {
        $payload['features']['items'][] = [
            'title' => (string) ($row['title'] ?? ''),
            'text' => (string) ($row['text'] ?? ''),
        ];
    }
    foreach (is_array($content['screens']['items'] ?? null) ? $content['screens']['items'] : [] as $row) {
        $payload['screens']['items'][] = [
            'caption' => (string) ($row['caption'] ?? ''),
        ];
    }
    foreach (is_array($content['faq']['items'] ?? null) ? $content['faq']['items'] : [] as $row) {
        $payload['faq']['items'][] = [
            'question' => (string) ($row['question'] ?? ''),
            'answer' => (string) ($row['answer'] ?? ''),
        ];
    }

    return $payload;
}

function apply_shared_fields(array $english, array $posted): array
{
    $english['site']['company_name'] = $posted['site']['company_name'] ?? $english['site']['company_name'] ?? '';
    $english['sections'] = $posted['sections'] ?? $english['sections'] ?? [];
    $english['stores'] = $posted['stores'] ?? $english['stores'] ?? [];
    $english['hero']['image_left'] = $posted['hero']['image_left'] ?? $english['hero']['image_left'] ?? '';
    $english['hero']['image_right'] = $posted['hero']['image_right'] ?? $english['hero']['image_right'] ?? '';
    $english['contact']['email'] = $posted['contact']['email'] ?? $english['contact']['email'] ?? '';
    $english['contact']['address'] = $posted['contact']['address'] ?? $english['contact']['address'] ?? '';
    $english['contact']['telegram'] = $posted['contact']['telegram'] ?? $english['contact']['telegram'] ?? '';
    $english['contact']['x'] = $posted['contact']['x'] ?? $english['contact']['x'] ?? '';

    $items = [];
    foreach (is_array($posted['screens']['items'] ?? null) ? $posted['screens']['items'] : [] as $i => $item) {
        $items[] = [
            'image' => (string) ($item['image'] ?? ''),
            'caption' => (string) ($english['screens']['items'][$i]['caption'] ?? $item['caption'] ?? ''),
        ];
    }
    $english['screens']['items'] = $items;

    return $english;
}

function save_locale_content(string $lang, array $posted): bool
{
    if ($lang === kip_default_locale()) {
        return save_content($posted);
    }

    $english = apply_shared_fields(load_content(), $posted);
    if (!save_content($english)) {
        return false;
    }

    $json = json_encode(extract_locale_payload($posted), JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    return $json !== false && write_file_atomic(KIP_DATA . '/content.' . $lang . '.json', $json);
}

function load_page_content(string $lang): array
{
    $base = load_content();
    $base['ui'] = kip_ui_defaults();
    $base = overlay_text_fields($base, load_locale_file(kip_default_locale()));

    if ($lang !== kip_default_locale()) {
        $base = overlay_text_fields($base, load_locale_file($lang));
        $base = overlay_text_fields($base, load_locale_overrides($lang));
    }

    $base['ui'] = array_merge(kip_ui_defaults(), is_array($base['ui']) ? $base['ui'] : []);
    return $base;
}

function locale_font_href(string $lang): string
{
    $families = [
        'family=Geist:wght@400;500;600;700',
        'family=Geist+Mono:wght@400;500',
        'family=Noto+Sans:wght@400;500;600;700',
    ];
    if ($lang === 'ka') {
        $families[] = 'family=Noto+Sans+Georgian:wght@400;500;600;700';
    }
    if ($lang === 'hy') {
        $families[] = 'family=Noto+Sans+Armenian:wght@400;500;600;700';
    }
    return 'https://fonts.googleapis.com/css2?' . implode('&', $families) . '&display=swap';
}
