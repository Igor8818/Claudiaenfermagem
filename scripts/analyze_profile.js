const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, 'raw_profile.html'), 'utf8');

// Search for shortcodes (/p/ or /reel/)
const shortcodes = html.match(/"shortcode":"([^"]+)"/g);
console.log('Shortcodes found:', shortcodes ? shortcodes.slice(0, 20) : 'None');

// Search for display_url or image URLs
const displayUrls = html.match(/"display_url":"([^"]+)"/g);
console.log('Display URLs count:', displayUrls ? displayUrls.length : 0);

// Search for post URLs or graphql data
const edgeOwnerToTimelineMedia = html.match(/"edge_owner_to_timeline_media":\{"count":\d+,"page_info":\{[^}]+\},"edges":\[(.*?)\]\}/);
if (edgeOwnerToTimelineMedia) {
  console.log('Found edge_owner_to_timeline_media!');
}

// Search for any .jpg or .webp links
const allJpgs = Array.from(new Set(html.match(/https:\/\/[^"'\s\\]+\.jpg[^"'\s\\]*/g) || []));
console.log('Total JPG links found in HTML:', allJpgs.length);
if (allJpgs.length > 0) {
  fs.writeFileSync(path.join(__dirname, 'found_jpgs.json'), JSON.stringify(allJpgs, null, 2));
  console.log('Saved all JPGs to found_jpgs.json');
}
