# Test Plan - Random Selector Improvements

## Test Before Commit Checklist

### 1. localStorage Persistence ✅
- [ ] Add options to the wheel
- [ ] Refresh the page (F5)
- [ ] Verify options are still there
- [ ] Change wheel name
- [ ] Refresh again
- [ ] Verify wheel name persisted

### 2. Mobile Responsiveness ✅
- [ ] Open in mobile view (F12 → Toggle device toolbar)
- [ ] Check wheel is perfectly circular (not oval)
- [ ] Verify spin button is large enough (should be 54px height minimum)
- [ ] Test on different mobile sizes (iPhone, Android)
- [ ] Tap the spin button easily with mouse (simulating thumb)

### 3. Bulk Input Mode ✅
- [ ] Click "📋 Bulk Add (Paste List)" button
- [ ] Paste comma-separated list: `Apple, Banana, Cherry`
- [ ] Click "✅ Add All Items"
- [ ] Verify all 3 items appear in the wheel
- [ ] Try with newline-separated list
- [ ] Try with semicolon-separated list
- [ ] Verify all formats work

### 4. Thai Presets ✅
- [ ] Click "🍜 Thai Food" preset
- [ ] Verify 8 Thai food items load
- [ ] Click "🎉 Party Games" preset
- [ ] Verify party game items load
- [ ] Click "🎰 Lottery (00-99)" preset
- [ ] Verify 100 numbers (00-99) load
- [ ] Click "🔢 Numbers (1-100)" preset
- [ ] Verify 100 numbers (1-100) load

### 5. Shareable URLs ✅
- [ ] Add custom options to wheel
- [ ] Click "🔗 Share This Wheel" button
- [ ] Verify URL appears with list parameter
- [ ] Click "📋 Copy Link" button
- [ ] Verify alert shows "Link copied"
- [ ] Open URL in new tab/incognito window
- [ ] Verify wheel loads with same options

### 6. Sound Effects ✅
- [ ] Click the spin button
- [ ] Listen for ticking sounds during spin
- [ ] Verify ticking stops when wheel stops
- [ ] Listen for "win" sound when result shows
- [ ] Click the 🔊 mute button
- [ ] Verify icon changes to 🔇
- [ ] Spin again
- [ ] Verify NO sounds play
- [ ] Click mute button again
- [ ] Verify sounds work again

### 7. Overall Integration Test ✅
- [ ] Start fresh (clear localStorage in DevTools)
- [ ] Load Thai Food preset
- [ ] Add 2 more custom items via bulk input
- [ ] Spin the wheel with sound ON
- [ ] Verify smooth animation
- [ ] Verify ticking sounds
- [ ] Verify win sound
- [ ] Generate share URL
- [ ] Open in new window
- [ ] Verify all items loaded from URL

### 8. Fortune Sticks Feature ✅
- [ ] Navigate to "Fortune Sticks" from menu
- [ ] Add 5-10 choices using the input form
- [ ] Verify choices appear in the list
- [ ] Verify choices appear as sticks in bottle
- [ ] Click "Shake" button
- [ ] Verify bottle shakes with animation
- [ ] Verify shake sounds play (if unmuted)
- [ ] Verify one stick falls out with animation
- [ ] Verify result displays after falling animation
- [ ] Click "Shake Again" to reset
- [ ] Verify can shake multiple times
- [ ] Delete individual choices
- [ ] Verify deleted choices disappear from bottle
- [ ] Click mute button
- [ ] Shake again and verify no sounds
- [ ] Click "Clear All" button
- [ ] Verify all choices cleared
- [ ] Refresh page
- [ ] Verify choices persisted (localStorage)
- [ ] Test on mobile view - verify bottle is visible and shake button is accessible

## Expected Results

All features should work smoothly:
- ✅ Data persists across refreshes
- ✅ Mobile UI is touch-friendly
- ✅ Bulk input accepts multiple formats
- ✅ Thai presets load instantly
- ✅ Share URLs work correctly
- ✅ Sounds play and mute works
- ✅ Fortune Sticks shake animation is smooth
- ✅ Stick falling animation works properly
- ✅ Fortune Sticks choices persist in localStorage

## Browser Compatibility

Test in:
- [ ] Chrome/Edge (primary)
- [ ] Firefox
- [ ] Safari (if available)
- [ ] Mobile browsers

## Performance

- [ ] Page loads quickly
- [ ] Wheel spins smoothly
- [ ] No lag when adding many items (test with 100 items)
- [ ] Sounds don't cause performance issues

## Notes

- Sound uses Web Audio API (no external files needed)
- localStorage has 5MB limit (more than enough for wheel data)
- URL encoding handles special characters automatically
