# ClassPicker — Random Student Selection Tool
ClassPicker is a free, open-source, browser-based tool designed to enhance classroom engagement through fair and transparent random student selection. Perfect for Q&A sessions, group leadership assignments, and team formation.

## 📋 Requirements

### Minimum System Requirements

- **Operating System**: Windows 7+, macOS 10.12+, Linux (any modern distribution)
- **Browser**: 
  - Google Chrome 90+
  - Mozilla Firefox 88+
  - Microsoft Edge 90+
  - Safari 14+
- **JavaScript**: Must be enabled
- **LocalStorage**: Must be enabled (default in all modern browsers)
- **Screen Resolution**: 1024x768 minimum (recommended: 1920x1080)

### Software Dependencies

ClassPicker uses the following libraries loaded from CDN:

- **Bootstrap 5.3.2**: UI framework
- **jQuery 3.6.4**: JavaScript library
- **Bootstrap Icons 1.11.4**: Icon library

These are loaded automatically when you open the application—no manual installation needed.

## 📥 Installation

### Option 1: Direct Download (Recommended for Most Users)

1. **Download the application**:
   ```bash
   git clone https://github.com/ikuswardayan/classpicker.git
   ```
   
   Or download as ZIP:
   - Go to https://github.com/ikuswardayan/classpicker
   - Click the green "Code" button
   - Select "Download ZIP"
   - Extract the ZIP file to your desired location

2. **Open the application**:
   - Navigate to the extracted folder
   - Double-click `index.html`
   - The application will open in your default browser

That's it! No installation, no setup, no configuration needed.



## 🚀 Quick Start Guide

### First Time Setup

1. **Open ClassPicker**: Double-click `index.html` or access via web server
2. **Load Sample Data**: The application loads with sample participant data automatically
3. **Or Import Your Data**:
   - Click "Import CSV" button
   - Select your CSV file with student information
   - Supported format: `id,idNumber,name,isPresent,isIncluded,timesSelected,timesAnswered,timesCorrect`

### Basic Usage

#### Taking Attendance
1. Check the "Present" checkbox for each student who is present
2. Click "Reset" button to sync inclusion status with attendance

#### Running a Random Draw
1. Ensure eligible students have "Included" checkbox checked
2. Click the blue "Spin" button at the bottom right
3. Watch the animated slot machine reveal the selected student
4. The selected student will be automatically highlighted and excluded from the next draw

#### Managing Participants
- **Add**: Click "Add" button to create a new participant
- **Edit**: Click directly on any field to edit inline
- **Delete**: Click the red trash icon to remove a participant
- **Reset Data**: Click "Reset Participant" to reload sample data

#### Data Management
- **Export**: Click "Export CSV" to save current data
- **Import**: Click "Import CSV" to load data from file
- **Clear**: Click "Clear All" to remove all participants (with confirmation)

## 📊 CSV File Format

### Import Format

Your CSV file should have the following columns (header row required):

```csv
id,idNumber,name,isPresent,isIncluded,timesSelected,timesAnswered,timesCorrect
1,7025241001,Achmad Bisri,1,1,0,0,0
2,7025241002,Windi Eka Yulia Retnani,1,1,0,0,0
3,7025241003,Erwin Duadja Betha,1,1,0,0,0
```

### Column Descriptions

| Column | Type | Description | Required |
|--------|------|-------------|----------|
| `id` | Integer | Unique identifier | Yes |
| `idNumber` | String | Student ID/NRP | Yes |
| `name` | String | Student name | Yes |
| `isPresent` | Boolean | 1 = present, 0 = absent | Yes |
| `isIncluded` | Boolean | 1 = eligible for draw, 0 = excluded | Yes |
| `timesSelected` | Integer | Number of times selected | Yes |
| `timesAnswered` | Integer | Number of times answered | Yes |
| `timesCorrect` | Integer | Number of correct answers | Yes |

### Legacy Format Support

ClassPicker also supports old column names for backward compatibility:
- `nrp`, `NRP` → `idNumber`
- `nama`, `Nama`, `NAMA` → `name`
- `ck_hadir` → `isPresent`
- `ck_dilibatkan` → `isIncluded`
- `jumlah_terpilih` → `timesSelected`
- `jumlah_menjawab` → `timesAnswered`
- `jumlah_jawaban_benar` → `timesCorrect`

## 🎓 Usage Scenarios

### Scenario 1: Question & Answer Sessions

**Goal**: Randomly select students to answer questions during lectures

1. Mark present students
2. Click "Reset" to include all present students
3. Ask your question
4. Click "Spin" to select a respondent
5. The selected student answers (automatically excluded from next draw)
6. Update "Answered" and "Correct" counts as needed
7. Repeat for next question

### Scenario 2: Group Leadership Assignment

**Goal**: Fairly distribute leadership roles across multiple activities

1. Ensure all eligible students are included
2. Click "Spin" to select first leader
3. Record the assignment (student is auto-excluded)
4. For next activity, click "Spin" again
5. Continue until all students have led at least once
6. Click "Reset" to include everyone for a new cycle

### Scenario 3: Team Formation

**Goal**: Create balanced teams without social bias

1. Decide number of teams (e.g., 4 teams)
2. Click "Spin" → Student A joins Team 1
3. Click "Spin" → Student B joins Team 2
4. Continue alternating until all students assigned
5. Teams are formed fairly without friendship clustering

## 🔧 Troubleshooting

### Problem: Application won't open

**Solution**:
- Ensure JavaScript is enabled in your browser
- Try a different browser (Chrome, Firefox, Edge recommended)
- Check if you have the latest browser version
- Clear browser cache (Ctrl+Shift+Del / Cmd+Shift+Del)

### Problem: Data not saving between sessions

**Solution**:
- Check if LocalStorage is enabled (should be enabled by default)
- Don't open the file using `file://` protocol in some browsers—use a web server instead
- Check if you're in Incognito/Private mode (LocalStorage is temporary in these modes)
- Verify browser settings allow local data storage

### Problem: CSV import fails

**Solution**:
- Ensure CSV file has header row
- Check that all required columns are present
- Verify CSV is UTF-8 encoded (not UTF-16 or other encodings)
- Remove any special characters or formatting
- Ensure boolean values are 0, 1, "true", or "false"

### Problem: Animation stutters or lags

**Solution**:
- Close other browser tabs to free up memory
- Try on a different device or browser
- Reduce number of participants (performance degrades with 500+ participants)
- Ensure hardware acceleration is enabled in browser settings

### Problem: Selected row not highlighted

**Solution**:
- Scroll manually if the page doesn't auto-scroll
- Check if CSS is loading properly (refresh page)
- Verify browser supports CSS animations
- Try clearing browser cache and reloading

### Problem: Can't save CSV export file

**Solution**:
- Check browser permissions for file downloads
- Try a different browser (Chrome and Edge have best support)
- Ensure you have write permissions in the selected folder
- Disable browser extensions that might block downloads

## 💡 Tips & Best Practices

### For Teachers

1. **Start of Semester**: Import class roster from your LMS
2. **Each Class**: Take attendance first, then click "Reset"
3. **During Lectures**: Use for Q&A to maintain engagement
4. **End of Class**: Export CSV to backup participation data
5. **Weekly Review**: Check participation statistics to identify quiet students

### For Maximum Engagement

1. **Transparency**: Always project the screen so everyone sees the fair selection
2. **Preparation**: Tell students about ClassPicker at course start to encourage preparation
3. **Supportive Environment**: Frame errors as learning opportunities, not failures
4. **Consistency**: Use regularly so students expect potential selection
5. **Feedback**: Record answer quality to track learning progress

### Data Management

1. **Regular Backups**: Export CSV weekly to prevent data loss
2. **Archiving**: Keep semester-end CSVs for future reference
3. **Privacy**: Never share exported CSVs without removing identifying information
4. **Analysis**: Import CSVs into Excel/Google Sheets for deeper analysis

## 🏗️ Technical Details

### File Structure

```
classpicker/
├── index.html              # Main application file
├── README.md               # This documentation
├── LICENSE                 # MIT License
├── sample.json             # Sample participant data
├── assets/
│   ├── css/
│   │   └── style.css       # Custom styles
│   ├── js/
│   │   └── app.js          # Application logic
│   └── images/
│       └── screenshot.png  # Application screenshot
```

### LocalStorage Structure

Data is stored in your browser's LocalStorage with key:
```
class_spinner_data_v1
```

Data format (JSON):
```json
[
  {
    "id": 1,
    "idNumber": "7025241001",
    "name": "Achmad Bisri",
    "isPresent": true,
    "isIncluded": true,
    "timesSelected": 0,
    "timesAnswered": 0,
    "timesCorrect": 0
  }
]
```

### Browser Compatibility

| Browser | Version | Status | Notes |
|---------|---------|--------|-------|
| Chrome | 90+ | ✅ Fully Supported | Recommended |
| Firefox | 88+ | ✅ Fully Supported | Recommended |
| Edge | 90+ | ✅ Fully Supported | Recommended |
| Safari | 14+ | ✅ Fully Supported | File System Access API limited |
| Opera | 76+ | ✅ Fully Supported | - |
| IE11 | N/A | ❌ Not Supported | Use Edge instead |

### Performance

- **Participant Limit**: Tested up to 500 participants
- **Recommended**: 50-200 participants per class
- **LocalStorage Capacity**: ~5-10MB (sufficient for 1000+ participants)
- **Animation Speed**: 2.2 seconds per draw
- **Data Operations**: Instant (< 10ms for typical class sizes)

## 🔒 Privacy & Security

ClassPicker is designed with privacy as a core principle:

- **✅ No Data Collection**: We don't collect any data
- **✅ No Cloud Storage**: All data stays in your browser
- **✅ No User Tracking**: No analytics, no cookies, no tracking
- **✅ No Account Required**: Use immediately without registration
- **✅ No Internet Required**: Works completely offline after initial load
- **✅ Open Source**: Full transparency—inspect the code yourself

### Data Safety

- Data is stored locally using browser's LocalStorage API
- Data persists across browser sessions
- Data is NOT shared across devices or browsers
- Data is lost if:
  - Browser data/cache is cleared
  - Browser is uninstalled
  - Operating system is reinstalled

**⚠️ Important**: Always export your data regularly as backup!

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### Reporting Bugs

1. Check if the issue already exists in [GitHub Issues](https://github.com/ikuswardayan/classpicker/issues)
2. Create a new issue with:
   - Clear title
   - Detailed description
   - Steps to reproduce
   - Expected vs actual behavior
   - Browser and OS information
   - Screenshots if applicable

### Suggesting Features

1. Open a new issue with `[Feature Request]` in the title
2. Describe the feature and its benefits
3. Explain use cases and user scenarios

### Code Contributions

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow existing code style (jQuery patterns)
- Test in multiple browsers
- Update documentation for new features
- Keep changes focused and atomic
- Write clear commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### What this means:

✅ **You CAN**:
- Use commercially
- Modify the code
- Distribute
- Use privately
- Sublicense

❌ **You CANNOT**:
- Hold us liable
- Expect warranty

📋 **You MUST**:
- Include the original license
- Include copyright notice

## 👥 Authors & Contributors

- **Imam Kuswardayan** - *Initial work* - [ikuswardayan](https://github.com/ikuswardayan)
- **Umi Laili Yuhana** - *Research supervision*
- **Ary Mazharuddin Shiddiqi** - *Research supervision*
- **Misita Anwar** - *Collaboration*
- **Hadziq Fabroyir** - *Research support*


## 📧 Contact & Support

- **Email**: imam@its.ac.id
- **Institution**: Institut Teknologi Sepuluh Nopember, Surabaya, Indonesia
- **GitHub Issues**: [Report a bug or request a feature](https://github.com/ikuswardayan/classpicker/issues)

## 🙏 Acknowledgments

- Built with [Bootstrap 5](https://getbootstrap.com/)
- Powered by [jQuery](https://jquery.com/)
- Icons from [Bootstrap Icons](https://icons.getbootstrap.com/)
- Inspired by the need for equitable classroom participation
- Thanks to all educators who provided feedback during development

## 📚 Citation

If you use ClassPicker in your research or educational practice, please cite:

```bibtex
@article{kuswardayan2024classpicker,
  title={ClassPicker: A Gamified Random Selection Tool for Enhancing Classroom Engagement},
  author={Kuswardayan, Imam and Yuhana, Umi Laili and Shiddiqi, Ary Mazharuddin and Anwar, Misita and Fabroyir, Hadziq},
  journal={SoftwareX},
  year={2025},
  publisher={Elsevier}
}
```

## 🌟 Related Projects

- [Wheel of Names](https://wheelofnames.com/) - Alternative web-based spinner
- [Random Name Picker](https://www.randomlists.com/team-generator) - Team generator
- [ClassDojo](https://www.classdojo.com/) - Comprehensive classroom management

## 📈 Roadmap

### Version 1.1 (Planned)
- [ ] Dark mode support
- [ ] Multi-language interface (Indonesian, Spanish, Chinese)
- [ ] Sound effects toggle
- [ ] Custom animation speed

### Version 1.2 (Planned)
- [ ] Export to PDF
- [ ] Integration with Google Classroom
- [ ] Mobile app version
- [ ] Weighted random selection option

### Version 2.0 (Future)
- [ ] Cloud backup option
- [ ] Multi-class management
- [ ] Analytics dashboard
- [ ] LMS integration (Canvas, Moodle, Blackboard)

## ❓ FAQ

**Q: Is ClassPicker really free?**  
A: Yes! Completely free, no ads, no premium features, no hidden costs.

**Q: Do I need to install anything?**  
A: No installation needed. Just open `index.html` in a browser.

**Q: Will my data be lost if I close the browser?**  
A: No. Data persists in LocalStorage. Only clearing browser data will erase it.

**Q: Can I use ClassPicker on multiple computers?**  
A: Yes, but data doesn't sync between computers. Use CSV export/import to transfer data.

**Q: Is there a mobile app?**  
A: Not yet, but ClassPicker works in mobile browsers. A native app is planned for v1.2.

**Q: Can I customize the interface?**  
A: Yes! Edit `assets/css/style.css` to customize colors, fonts, and layout.

**Q: How many students can I add?**  
A: Tested up to 500. Recommended maximum is 200 for optimal performance.

**Q: Does ClassPicker work offline?**  
A: Yes! After initial load, it works completely offline.

**Q: Can I contribute to ClassPicker?**  
A: Absolutely! See the Contributing section above.

**Q: Where is my data stored?**  
A: In your browser's LocalStorage. Data never leaves your device.

---

## 🎉 Thank You!

Thank you for using ClassPicker! We hope it helps create more equitable and engaging classrooms. If you find it useful, please:

- ⭐ Star the repository on GitHub
- 📢 Share with fellow educators
- 🐛 Report bugs or suggest features
- 🤝 Contribute code or documentation

**Happy teaching!** 🎓✨

---

*Last updated: December 2024*
