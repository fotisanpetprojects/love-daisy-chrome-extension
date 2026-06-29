# Love Daisy Chrome Extension

A tiny Manifest V3 Chrome extension for the classic daisy game: click the extension, pluck the petals, and let the final petal decide.

## Status

Draft for now. The core interaction works, but the extension is still in early polish and testing.

## Load It In Chrome

1. Open `chrome://extensions`.
2. Turn on `Developer mode`.
3. Click `Load unpacked`.
4. Select this folder: `chrome-extension`.
5. Visit any normal web page and click the `Love Daisy` extension button.

Chrome does not allow extension scripts on internal pages like `chrome://extensions`, so test it on a regular site or the local preview page.

## Preview Without Installing

Open `preview.html` in a browser to try the overlay as a normal page script.

## Notes

- Petal counts are randomized in the common oxeye daisy range of about 15-35 ray florets.
- The extension injects only when clicked, using `activeTab` and `scripting` permissions.
- Clicking the extension button again closes the daisy overlay.
