# Development Notes

## Local Testing

1. Open `preview.html` directly for a quick visual check.
2. Load the extension through `chrome://extensions` for browser-level testing.
3. After changing extension files, click the reload icon on the `Love Daisy` extension card.
4. Refresh the page where the extension is being tested.

## Manual QA Checklist

- The daisy appears as a transparent overlay on top of the current page.
- The restart and close buttons stay in the upper-right corner.
- Petals can be plucked one at a time.
- The petal text alternates between `Loves me` and `Loves me not`.
- The final message is either `loves you!!!` or `loves you not :(`.
- Hearts or broken hearts remain visible long enough to notice the result.
- The extension does not run on Chrome internal pages.
