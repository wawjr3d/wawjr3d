#!/usr/bin/env bash
set -euo pipefail

# List of redirects: "source_url expected_destination"
declare -a redirects=(
  "https://wawjr3d.com/talks/responsive-video https://wawjr3d.com/talks/responsive-video.html"
  "https://wawjr3d.com/talks/everybody-likes-brisket https://wawjr3d.com/talks/everybody-likes-brisket.html"
  "https://wawjr3d.com/practice/last_substring.html https://wawjr3d.com/practice/last-substring.html"
  "https://wawjr3d.com/practice/test_suite.html https://wawjr3d.com/practice/test-suite.html"
  "https://wawjr3d.com/practice/random_coding.html https://wawjr3d.com/practice/random-coding.html"
  "https://wawjr3d.com/practice/audio_context.html https://wawjr3d.com/practice/audio-context.html"
)

errors=0

echo "🔍 Validating redirects..."
for entry in "${redirects[@]}"; do
  src=$(echo "$entry" | awk '{print $1}')
  expected=$(echo "$entry" | awk '{print $2}')

  # Follow redirects (-L) and capture final URL (-w '%{url_effective}')
  final=$(curl -s -o /dev/null -L -w '%{url_effective}' "$src")

  if [[ "$final" != "$expected" ]]; then
    echo "❌ Redirect mismatch:"
    echo "   Source:    $src"
    echo "   Expected:  $expected"
    echo "   Got:       $final"
    ((errors++))
  else
    echo "✅ $src → $expected"
  fi
done

if [[ $errors -gt 0 ]]; then
  echo "🚨 $errors redirect(s) failed!"
  exit 1
else
  echo "🎉 All redirects validated successfully!"
fi
