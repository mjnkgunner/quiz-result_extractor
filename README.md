Quiz Results Extractor
A Chrome extension that crawls HTML pages to extract quiz results from a table within a div with class table-responsive, processes the data, and exports it as a text file.
Overview
This extension is designed to help users extract quiz results (e.g., "Login" and "Percent Solved") from a table on any webpage containing a div with class table-responsive. It converts percentage scores to marks (e.g., 86.67% to 8.7) and saves the data in a quiz_results.txt file. The extension uses a popup button to trigger the extraction and a background script to handle file downloads.
Features

Extracts "Login"  and "Percent Solved" from the table.
Converts percentages to marks (divided by 10, rounded to 1 decimal place).
Exports data to quiz_results.txt with format Login  Mark
Includes detailed console logging for debugging.

Installation

Clone or Download the Repository:
Download the quizResult folder from the source or clone it to your desktop
Load the Extension in Chrome:
Open Google Chrome.
Go to chrome://extensions/.
Enable "Developer mode" in the top right corner.
Click "Load unpacked" and select the ~\Desktop\quizResult folder.
The extension icon should appear in your toolbar.


Verify Installation:

Reload the target webpage.
Check chrome://extensions/ for any errors.
