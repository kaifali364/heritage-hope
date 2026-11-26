# Heritage Hope

A map-first heritage explorer inspired by the supplied reference. The default view focuses on Madhya Pradesh, with a switch to an India-wide overview.

## Live site

https://heritage-hope-site.vercel.app

## Run it

```sh
npm install
npm run dev
```

## Audio guides

Open any place card or map pin to see its audio guide. Narration uses the browser's built-in speech synthesis, prefers an English (India) voice when available, and includes play, pause, resume, and stop controls. No audio files or voice service are required. Voice availability depends on the visitor's browser and device.

## GPS tour and photos

Choose **Use my location & start** to request a GPS fix and rank the five closest listed places by straight-line distance. The browser only asks for location after this action. The tour gives one stop at a time; Google Maps provides the road directions after the visitor opens a directions link. The location remains in the page until the visitor chooses Google Maps directions.

Place photos are searched on Wikimedia Commons as a site is opened. When available, the image links to its file page and displays the recorded artist and license. Photo coverage and metadata vary by place.

## Map and place data

- The basemap uses OpenStreetMap tiles and retains the required contributor attribution.
- Madhya Pradesh district polygons are loaded on demand from [`vardhan-maps`](https://github.com/Vardhan-Systems/vardhan-maps), which derives boundaries from OpenStreetMap and applies published border corrections. District vintages follow that dataset's OSM coverage and may lag newly notified administrative changes.
- The 55-district selector includes recently created MP districts. Place pins are a curated starter catalogue with approximate map coordinates, not an official or complete inventory. Expand the catalogue with verified coordinates and sources before treating it as authoritative.
- For survey, legal, or official administrative use, use current Survey of India or Madhya Pradesh government boundary data.
