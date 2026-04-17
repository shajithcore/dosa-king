// NeoPixel Setup Block
Blockly.defineBlocksWithJsonArray([
  {
    "type": "neopixel_setup",
    "message0": "Setup NeoPixel Pin %1 Num Pixels %2",
    "args0": [
      { "type": "field_number", "name": "PIN", "value": 13 },
      { "type": "field_number", "name": "NUM", "value": 8 }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#ff9800"
  },
  {
    "type": "neopixel_set_color",
    "message0": "Set Pixel %1 to Color R %2 G %3 B %4",
    "args0": [
        { "type": "input_value", "name": "PIXEL" },
        { "type": "input_value", "name": "R" },
        { "type": "input_value", "name": "G" },
        { "type": "input_value", "name": "B" }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#ff9800"
  },
  {
    "type": "neopixel_show",
    "message0": "NeoPixel Show Changes",
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#ff9800"
  },
  {
  "type": "neopixel_clear",
  "message0": "NeoPixel Clear All",
  "previousStatement": null,
  "nextStatement": null,
  "colour": "#ff9800"
}

]);
