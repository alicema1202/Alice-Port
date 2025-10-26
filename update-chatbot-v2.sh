#!/bin/bash

# Create a temporary file to store HTML files that need updating
TEMP_FILE=$(mktemp)

# Function to check if a file needs chatbot components
check_file() {
    local file="$1"
    
    # Skip files that shouldn't be modified
    if [[ "$file" == *"/includes/"* ]] || [[ "$file" == *"/images/"* ]] || [[ "$file" == *"/test.html"* ]]; then
        return
    fi

    # Check if file is missing any required components
    if ! grep -q "chatbot-overlay.css" "$file" || \
       ! grep -q "toggleChatOverlay()" "$file" || \
       ! grep -q "chatbot-functions.js" "$file"; then
        echo "$file" >> "$TEMP_FILE"
    fi
}

# Find all HTML files in the project
find . -type f -name "*.html" | while read -r file; do
    check_file "$file"
done

# Update files that need chatbot components
while read -r file; do
    echo "Updating $file..."

    # Add CSS link if missing
    if ! grep -q "chatbot-overlay.css" "$file"; then
        sed -i '' 's/<\/head>/    <link href="css\/chatbot-overlay.css" rel="stylesheet">\n<\/head>/' "$file"
    fi

    # Add chatbot overlay HTML if missing
    if ! grep -q "chatbot-overlay" "$file"; then
        # Add after <body> tag
        sed -i '' '/<body>/a\
    <div class="buttons">\
        <a onclick="scrollWin()" class="back-to-top hide" style="display:none;" >\
            <i class="fa-solid fa-chevron-up"><\/i>\
        <\/a>\
        <a onclick="toggleChatOverlay()" class="chatbtn back-to-top">\
            <i class="fa-solid fa-message"><\/i>\
        <\/a>\
        \
        <!-- Chat Overlay -->\
        <div id="chatOverlay" class="chatbot-overlay">\
            <div class="chatbot-container">\
                <button class="chatbot-close" onclick="toggleChatOverlay()">\
                    <i class="fa-solid fa-xmark"><\/i>\
                <\/button>\
                <iframe class="chatbot-frame" src="includes\/chatbot.html"><\/iframe>\
            <\/div>\
        <\/div>\
    <\/div>' "$file"
    fi

    # Add script reference if missing
    if ! grep -q "chatbot-functions.js" "$file"; then
        sed -i '' 's/<\/html>/<script src="js\/chatbot-functions.js"><\/script>\n<\/html>/' "$file"
    fi
done < "$TEMP_FILE"

# Clean up
rm "$TEMP_FILE"

echo "Chatbot update complete!"
