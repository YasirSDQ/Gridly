const fs = require('fs');
let code = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');

code = code.replace(/file\.ID \|\| file\.Path/g, "file.id || file.path");
code = code.replace(/file\.IsDir/g, "file.isFolder");
code = code.replace(/file\.Size/g, "file.size");
code = code.replace(/file\.Name/g, "file.name");
code = code.replace(/file\.Path/g, "file.path");
code = code.replace(/file\.ModTime/g, "file.modifiedTime");
code = code.replace(/file\.MimeType/g, "file.mimeType");

code = code.replace(/selectedFile\.IsDir/g, "selectedFile.isFolder");
code = code.replace(/selectedFile\.Name/g, "selectedFile.name");
code = code.replace(/selectedFile\.MimeType/g, "selectedFile.mimeType");
code = code.replace(/selectedFile\.Size/g, "selectedFile.size");
code = code.replace(/selectedFile\.ModTime/g, "selectedFile.modifiedTime");

fs.writeFileSync('src/components/Dashboard.tsx', code);
