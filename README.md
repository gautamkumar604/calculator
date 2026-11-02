# Modern Calculator

A feature-rich, responsive web calculator with scientific functions, theme switching, and calculation history.

## Features

### Basic Operations
- Addition, subtraction, multiplication, and division
- Percentage calculations
- Decimal support
- Clear and delete functions

### Scientific Mode
Toggle scientific mode to access advanced mathematical functions:
- Square root (√)
- Power (x², xʸ)
- Logarithms (log, ln)
- Trigonometric functions (sin, cos, tan)
- Constants (π, e)
- Factorial (n!)
- Reciprocal (1/x)

### User Interface
- **Dark/Light Theme**: Toggle between light and dark themes
- **History Panel**: View and reuse previous calculations (stores up to 50 items)
- **Sound Effects**: Optional click sounds for button presses
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Keyboard Support**: Full keyboard input for all operations

### Technical Features
- Local storage persistence for settings and history
- Web Audio API for sound effects
- CSS custom properties for theming
- Accessibility support (focus states, high contrast mode, reduced motion)
- Service Worker support for PWA functionality

## File Structure

```
calculator/
├── index.html    # Main HTML structure
├── script.js     # Calculator logic and event handling
├── style.css     # Styling and responsive design
└── README.md     # Project documentation
```

## Usage

### Running the Calculator
Simply open `index.html` in a modern web browser. No build process or dependencies required.

### Basic Operations
1. **Numbers**: Click number buttons or use keyboard (0-9)
2. **Operators**: Click operator buttons or use keyboard (+, -, *, /)
3. **Equals**: Press = or Enter to calculate
4. **Clear**: Press AC or Escape to clear
5. **Delete**: Press ⌫ or Backspace to delete last digit
6. **Decimal**: Press . to add decimal point

### Scientific Functions
1. Click the "Scientific" button to toggle scientific mode
2. Use the additional buttons for advanced calculations
3. Trigonometric functions use degrees (not radians)

### Keyboard Shortcuts
- `0-9`: Input numbers
- `+`, `-`, `*`, `/`: Basic operators
- `Enter` or `=`: Calculate result
- `Escape`: Clear all
- `Backspace`: Delete last digit
- `%`: Percentage
- `.`: Decimal point

### History Panel
1. Click the history icon (clock symbol) to toggle the history panel
2. Click on any history item to reuse that result
3. Click "Clear" to delete all history

### Theme Toggle
Click the sun/moon icon to switch between light and dark themes. Your preference is saved automatically.

### Sound Toggle
Click the speaker icon to enable or disable sound effects. Your preference is saved automatically.

## Browser Compatibility

Works in all modern browsers that support:
- ES6 JavaScript
- CSS Custom Properties
- Web Audio API
- Local Storage

Tested on Chrome, Firefox, Safari, and Edge.

## Customization

### Colors
Modify the CSS custom properties in `:root` and `[data-theme="dark"]` sections of `style.css` to customize the color scheme.

### Sound
The sound effect is generated using the Web Audio API in the `playSound()` method in `script.js`. Modify the frequency, duration, or oscillator type to change the sound.

## Technical Details

### JavaScript Architecture
The calculator is implemented as a class-based component with the following key methods:
- `appendNumber()`: Handle number input
- `handleOperator()`: Process arithmetic operations
- `calculate()`: Perform calculations
- `handleScientific()`: Process scientific functions
- `updateDisplay()`: Update the UI
- `formatNumber()`: Format numbers for display
- `addToHistory()`: Store calculations in history

### State Management
Calculator state is maintained in instance variables:
- `currentValue`: Current input value
- `previousValue`: Previous value for operations
- `operation`: Pending operation
- `shouldResetScreen`: Flag to reset screen on next input
- `history`: Array of calculation history
- `soundEnabled`: Sound toggle state
- `scientificMode`: Scientific mode toggle state

### Persistence
Settings and history are persisted using localStorage:
- `calculator-theme`: Theme preference
- `calculator-sound`: Sound preference
- `calculator-scientific`: Scientific mode preference
- `calculator-history`: Calculation history array

## License

This project is open source and available for educational and personal use.

## Author

Created as a modern web calculator demonstration project.
