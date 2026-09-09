import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TARGET_DIR = path.resolve(__dirname, '../public/media/math-intellect/source');

export const MEDIA_ITEMS = [
  {
    id: 'MI-PH-001',
    filename: 'mi-crossing-desktop-01.jpg',
    unsplashId: 'dKY8oiGPLYY',
    creator: 'Darya Azokhava',
    creatorHandle: '@darya_cherryda',
    canonicalUrl: 'https://unsplash.com/photos/dKY8oiGPLYY',
    downloadEndpoint: 'https://unsplash.com/photos/dKY8oiGPLYY/download?force=true',
    directUrl: 'https://images.unsplash.com/photo-1762850300464-66f7cd2bacff?fm=jpg&fit=max&w=4000&q=92&ixlib=rb-4.1.0',
    minWidth: 1600,
    minHeight: 1000,
  },
  {
    id: 'MI-PH-002',
    filename: 'mi-crossing-mobile-01.jpg',
    unsplashId: 'zj3k2rfqDns',
    creator: 'Jason Ross',
    creatorHandle: '@_snid_',
    canonicalUrl: 'https://unsplash.com/photos/zj3k2rfqDns',
    downloadEndpoint: 'https://unsplash.com/photos/zj3k2rfqDns/download?force=true',
    directUrl: 'https://images.unsplash.com/photo-1670350879611-55028c3bfe0e?fm=jpg&fit=max&w=4000&q=92&ixlib=rb-4.1.0',
    minWidth: 1600,
    minHeight: 1000,
  },
  {
    id: 'MI-PH-003',
    filename: 'mi-crossing-shadow-02.jpg',
    unsplashId: 'Y1tpaNkoyYw',
    creator: 'Darya Azokhava',
    creatorHandle: '@darya_cherryda',
    canonicalUrl: 'https://unsplash.com/photos/Y1tpaNkoyYw',
    downloadEndpoint: 'https://unsplash.com/photos/Y1tpaNkoyYw/download?force=true',
    directUrl: 'https://images.unsplash.com/photo-1762850335307-43378c7c8a43?fm=jpg&fit=max&w=4000&q=92&ixlib=rb-4.1.0',
    minWidth: 1600,
    minHeight: 1000,
  },
  {
    id: 'MI-PH-004',
    filename: 'mi-intersection-overhead-01.jpg',
    unsplashId: 'cE_bS9C01Ag',
    creator: 'Zoshua Colah',
    creatorHandle: '@zoshuacolah',
    canonicalUrl: 'https://unsplash.com/photos/cE_bS9C01Ag',
    downloadEndpoint: 'https://unsplash.com/photos/cE_bS9C01Ag/download?force=true',
    directUrl: 'https://images.unsplash.com/photo-1741423680915-6f91a6054172?fm=jpg&fit=max&w=4000&q=92&ixlib=rb-4.1.0',
    minWidth: 1600,
    minHeight: 1000,
  },
  {
    id: 'MI-PH-005',
    filename: 'mi-murmuration-01.jpg',
    unsplashId: 'b7MZ6iGIoSI',
    creator: 'James Wainscoat',
    creatorHandle: '@tumbao1949',
    canonicalUrl: 'https://unsplash.com/photos/b7MZ6iGIoSI',
    downloadEndpoint: 'https://unsplash.com/photos/b7MZ6iGIoSI/download?force=true',
    directUrl: 'https://images.unsplash.com/photo-1516434233442-0c69c369b66d?fm=jpg&fit=max&w=4000&q=92&ixlib=rb-4.1.0',
    minWidth: 1600,
    minHeight: 1000,
  },
  {
    id: 'MI-PH-006',
    filename: 'mi-murmuration-sunset-02.jpg',
    unsplashId: 'jKNR--HDA_A',
    creator: 'Pete Godfrey',
    creatorHandle: '@octopus_photo',
    canonicalUrl: 'https://unsplash.com/photos/jKNR--HDA_A',
    downloadEndpoint: 'https://unsplash.com/photos/jKNR--HDA_A/download?force=true',
    directUrl: 'https://images.unsplash.com/photo-1684793130560-ae91254db9ac?fm=jpg&fit=max&w=4000&q=92&ixlib=rb-4.1.0',
    minWidth: 1600,
    minHeight: 1000,
  },
  {
    id: 'MI-PH-007',
    filename: 'mi-murmuration-olive-03.jpg',
    unsplashId: '3EB6j0KWtaM',
    creator: 'Mohamed Fsili',
    creatorHandle: '@mfsili',
    canonicalUrl: 'https://unsplash.com/photos/3EB6j0KWtaM',
    downloadEndpoint: 'https://unsplash.com/photos/3EB6j0KWtaM/download?force=true',
    directUrl: 'https://images.unsplash.com/photo-1732524271227-70aaf324faca?fm=jpg&fit=max&w=4000&q=92&ixlib=rb-4.1.0',
    minWidth: 1600,
    minHeight: 1000,
  },
  {
    id: 'MI-PH-008',
    filename: 'mi-river-branching-01.jpg',
    unsplashId: 'GygPFmXGD1o',
    creator: 'Dan Roizer',
    creatorHandle: '@danroizer',
    canonicalUrl: 'https://unsplash.com/photos/GygPFmXGD1o',
    downloadEndpoint: 'https://unsplash.com/photos/GygPFmXGD1o/download?force=true',
    directUrl: 'https://images.unsplash.com/photo-1448099940878-e0c48ea3a165?fm=jpg&fit=max&w=4000&q=92&ixlib=rb-4.1.0',
    minWidth: 1600,
    minHeight: 1000,
  },
  {
    id: 'MI-PH-009',
    filename: 'mi-river-okavango-02.jpg',
    unsplashId: '4ZCA3xukIso',
    creator: 'Wynand Uys',
    creatorHandle: '@wynand_uys',
    canonicalUrl: 'https://unsplash.com/photos/4ZCA3xukIso',
    downloadEndpoint: 'https://unsplash.com/photos/4ZCA3xukIso/download?force=true',
    directUrl: 'https://images.unsplash.com/photo-1531208853003-c1ec1b8a81d7?fm=jpg&fit=max&w=4000&q=92&ixlib=rb-4.1.0',
    minWidth: 1600,
    minHeight: 1000,
  },
  {
    id: 'MI-PH-010',
    filename: 'mi-rail-yard-01.jpg',
    unsplashId: '9v1cuPQ5hKM',
    creator: 'Jakub Nawrot',
    creatorHandle: '@jacob_lens',
    canonicalUrl: 'https://unsplash.com/photos/9v1cuPQ5hKM',
    downloadEndpoint: 'https://unsplash.com/photos/9v1cuPQ5hKM/download?force=true',
    directUrl: 'https://images.unsplash.com/photo-1560717470-62006e1b6d0b?fm=jpg&fit=max&w=3625&q=92&ixlib=rb-4.1.0',
    minWidth: 1600,
    minHeight: 1000,
  },
  {
    id: 'MI-PH-011',
    filename: 'mi-rail-tracks-02.jpg',
    unsplashId: 'ywUOMuLZovY',
    creator: 'Bence Balla-Schottner',
    creatorHandle: '@ballaschottner',
    canonicalUrl: 'https://unsplash.com/photos/ywUOMuLZovY',
    downloadEndpoint: 'https://unsplash.com/photos/ywUOMuLZovY/download?force=true',
    directUrl: 'https://images.unsplash.com/photo-1565900290200-52daa0c9faec?fm=jpg&fit=max&w=4000&q=92&ixlib=rb-4.1.0',
    minWidth: 1600,
    minHeight: 1000,
  },
  {
    id: 'MI-PH-012',
    filename: 'mi-rail-hub-03.jpg',
    unsplashId: 'lRfjCsJOWSM',
    creator: 'Patrick Federi',
    creatorHandle: '@federi',
    canonicalUrl: 'https://unsplash.com/photos/lRfjCsJOWSM',
    downloadEndpoint: 'https://unsplash.com/photos/lRfjCsJOWSM/download?force=true',
    directUrl: 'https://images.unsplash.com/photo-1608732510949-1ceb94b8d47f?fm=jpg&fit=max&w=4000&q=92&ixlib=rb-4.1.0',
    minWidth: 1600,
    minHeight: 1000,
  },
  {
    id: 'MI-PH-013',
    filename: 'mi-cargo-port-01.jpg',
    unsplashId: 'wiIqTWoiUQY',
    creator: 'Efim Borisov',
    creatorHandle: '@efimborisov',
    canonicalUrl: 'https://unsplash.com/photos/wiIqTWoiUQY',
    downloadEndpoint: 'https://unsplash.com/photos/wiIqTWoiUQY/download?force=true',
    directUrl: 'https://images.unsplash.com/photo-1691733137330-67a2ab7e42ea?fm=jpg&fit=max&w=4000&q=92&ixlib=rb-4.1.0',
    minWidth: 1600,
    minHeight: 1000,
  },
  {
    id: 'MI-PH-014',
    filename: 'mi-cargo-aerial-02.jpg',
    unsplashId: 'IVG8SDczupk',
    creator: 'Logan Voss',
    creatorHandle: '@loganvoss',
    canonicalUrl: 'https://unsplash.com/photos/IVG8SDczupk',
    downloadEndpoint: 'https://unsplash.com/photos/IVG8SDczupk/download?force=true',
    directUrl: 'https://images.unsplash.com/photo-1724364552281-dbed323c4633?fm=jpg&fit=max&w=4000&q=92&ixlib=rb-4.1.0',
    minWidth: 1600,
    minHeight: 1000,
  },
  {
    id: 'MI-PH-015',
    filename: 'mi-container-topdown-03.jpg',
    unsplashId: '0A7YwYhZhWw',
    creator: 'Bent Van Aeken',
    creatorHandle: '@bentje',
    canonicalUrl: 'https://unsplash.com/photos/0A7YwYhZhWw',
    downloadEndpoint: 'https://unsplash.com/photos/0A7YwYhZhWw/download?force=true',
    directUrl: 'https://images.unsplash.com/photo-1724597500306-a4cbb7d1324e?fm=jpg&fit=max&w=4000&q=92&ixlib=rb-4.1.0',
    minWidth: 1600,
    minHeight: 1000,
  },
  {
    id: 'MI-PH-016',
    filename: 'mi-cargo-flow-04.jpg',
    unsplashId: 'FPKnAO-CF6M',
    creator: 'Venti Views',
    creatorHandle: '@ventiviews',
    canonicalUrl: 'https://unsplash.com/photos/FPKnAO-CF6M',
    downloadEndpoint: 'https://unsplash.com/photos/FPKnAO-CF6M/download?force=true',
    directUrl: 'https://images.unsplash.com/photo-1585713181935-d5f622cc2415?fm=jpg&fit=max&w=4000&q=92&ixlib=rb-4.1.0',
    minWidth: 1600,
    minHeight: 1000,
  },
  {
    id: 'MI-PH-017',
    filename: 'mi-water-field-01.jpg',
    unsplashId: 'Q5QspluNZmM',
    creator: 'Linus Nylund',
    creatorHandle: '@dreamsoftheoceans',
    canonicalUrl: 'https://unsplash.com/photos/Q5QspluNZmM',
    downloadEndpoint: 'https://unsplash.com/photos/Q5QspluNZmM/download?force=true',
    directUrl: 'https://images.unsplash.com/photo-1512138664757-360e0aad5132?fm=jpg&fit=max&w=4000&q=92&ixlib=rb-4.1.0',
    minWidth: 1600,
    minHeight: 1000,
  },
  {
    id: 'MI-PH-018',
    filename: 'mi-water-rings-02.jpg',
    unsplashId: 'kKpTHqM2K-c',
    creator: 'Jackson Hendry',
    creatorHandle: '@actionjackson801',
    canonicalUrl: 'https://unsplash.com/photos/kKpTHqM2K-c',
    downloadEndpoint: 'https://unsplash.com/photos/kKpTHqM2K-c/download?force=true',
    directUrl: 'https://images.unsplash.com/photo-1511198922712-e31c72f8fcd4?fm=jpg&fit=max&w=4000&q=92&ixlib=rb-4.1.0',
    minWidth: 1600,
    minHeight: 1000,
  },
  {
    id: 'MI-PH-019',
    filename: 'mi-water-dark-03.jpg',
    unsplashId: 'ZpKxweXHqkc',
    creator: 'Biel Morro',
    creatorHandle: '@bielmorro',
    canonicalUrl: 'https://unsplash.com/photos/ZpKxweXHqkc',
    downloadEndpoint: 'https://unsplash.com/photos/ZpKxweXHqkc/download?force=true',
    directUrl: 'https://images.unsplash.com/photo-1493752689441-72be47db3f91?fm=jpg&fit=max&w=4000&q=92&ixlib=rb-4.1.0',
    minWidth: 1600,
    minHeight: 1000,
  },
  {
    id: 'MI-PH-020',
    filename: 'mi-desert-road-01.jpg',
    unsplashId: 'fyi2-m9asWg',
    creator: 'Alex Diaz',
    creatorHandle: '@memory_terra',
    canonicalUrl: 'https://unsplash.com/photos/fyi2-m9asWg',
    downloadEndpoint: 'https://unsplash.com/photos/fyi2-m9asWg/download?force=true',
    directUrl: 'https://images.unsplash.com/photo-1634151296751-58b339799778?fm=jpg&fit=max&w=4000&q=92&ixlib=rb-4.1.0',
    minWidth: 1600,
    minHeight: 1000,
  },
  {
    id: 'MI-PH-021',
    filename: 'mi-desert-road-02.jpg',
    unsplashId: 'rbDvm1HBJqg',
    creator: 'Alex Diaz',
    creatorHandle: '@memory_terra',
    canonicalUrl: 'https://unsplash.com/photos/rbDvm1HBJqg',
    downloadEndpoint: 'https://unsplash.com/photos/rbDvm1HBJqg/download?force=true',
    directUrl: 'https://images.unsplash.com/photo-1633876652758-814defbf4793?fm=jpg&fit=max&w=4000&q=92&ixlib=rb-4.1.0',
    minWidth: 1600,
    minHeight: 1000,
  },
  {
    id: 'MI-PH-022',
    filename: 'mi-desert-road-03.jpg',
    unsplashId: '1BJgOSThXbw',
    creator: 'naeim jafari',
    creatorHandle: '@naeimj',
    canonicalUrl: 'https://unsplash.com/photos/1BJgOSThXbw',
    downloadEndpoint: 'https://unsplash.com/photos/1BJgOSThXbw/download?force=true',
    directUrl: 'https://images.unsplash.com/photo-1649651738909-967f63511615?fm=jpg&fit=max&w=4000&q=92&ixlib=rb-4.1.0',
    minWidth: 1600,
    minHeight: 1000,
  },
];

async function downloadAsset(item) {
  const destPath = path.join(TARGET_DIR, item.filename);
  if (fs.existsSync(destPath)) {
    const stat = fs.statSync(destPath);
    if (stat.size > 50000) {
      console.log(`[SKIP] ${item.id} already exists (${(stat.size / 1024).toFixed(1)} KB): ${item.filename}`);
      return { item, success: true, cached: true };
    }
  }

  const urlsToTry = [item.directUrl, item.downloadEndpoint];
  for (const url of urlsToTry) {
    try {
      console.log(`[FETCH] ${item.id} (${item.unsplashId}) from ${url.slice(0, 70)}...`);
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
        },
        redirect: 'follow',
      });

      if (!res.ok) {
        console.warn(`[FAIL] ${item.id} HTTP ${res.status} from ${url.slice(0, 45)}`);
        continue;
      }

      const contentType = res.headers.get('content-type') || '';
      if (!contentType.startsWith('image/')) {
        console.warn(`[FAIL] ${item.id} returned non-image content-type: ${contentType}`);
        continue;
      }

      const arrayBuffer = await res.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      if (buffer.length < 5000) {
        console.warn(`[FAIL] ${item.id} downloaded payload too small: ${buffer.length} bytes`);
        continue;
      }

      fs.writeFileSync(destPath, buffer);
      console.log(`[OK] ${item.id} ${item.unsplashId} saved (${(buffer.length / 1024).toFixed(1)} KB) -> ${item.filename}`);
      return { item, success: true, size: buffer.length };
    } catch (err) {
      console.warn(`[ERROR] ${item.id} download attempt error:`, err.message);
    }
  }

  return { item, success: false };
}

async function main() {
  fs.mkdirSync(TARGET_DIR, { recursive: true });
  console.log(`Starting media download of ${MEDIA_ITEMS.length} assets to ${TARGET_DIR}`);

  const results = [];
  for (const item of MEDIA_ITEMS) {
    const result = await downloadAsset(item);
    results.push(result);
  }

  const succeeded = results.filter((r) => r.success);
  const failed = results.filter((r) => !r.success);

  console.log('\n=== DOWNLOAD SUMMARY ===');
  console.log(`Total: ${MEDIA_ITEMS.length}`);
  console.log(`Succeeded: ${succeeded.length}`);
  console.log(`Failed: ${failed.length}`);
  if (failed.length > 0) {
    console.log('Failed Assets:');
    for (const f of failed) {
      console.log(` - ${f.item.id} (${f.item.unsplashId}): ${f.item.filename}`);
    }
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((err) => {
    console.error('Fatal media fetch error:', err);
    process.exit(1);
  });
}
