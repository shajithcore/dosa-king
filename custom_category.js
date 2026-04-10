// class EdusharksCategory extends Blockly.ToolboxCategory {
//   constructor(categoryDef, toolbox, opt_parent) {
//     super(categoryDef, toolbox, opt_parent);
//   }

//   /** @override - This removes the left color strip */
//   addColourBorder_(colour) {
//   // Instead of just painting the background, we save the color as a variable
//   // This allows the CSS to "know" what color to use on hover
//   this.rowDiv_.style.setProperty('--category-hover-color', colour);

//   // 2. Set the initial border color (optional: left-side stripe)
//     this.rowDiv_.style.borderLeft = `8px solid ${colour}`;
  
//   // Set the default look (white background, colored text)
//   this.rowDiv_.style.backgroundColor = 'transparent';
  
//   const label = this.rowDiv_.getElementsByClassName('blocklyToolboxCategoryLabel')[0];
//   if (label) {
//     label.style.color = colour; // Text matches the category color initially  
//   }
// }

//   /** @override - This handles the color swapping */
//   setSelected(isSelected) {
//     // Find the label Blockly created for us
//     var labelDom = this.rowDiv_.getElementsByClassName('blocklyToolboxCategoryLabel')[0];
    
//     if (labelDom) { // Safety check
//       if (isSelected) {
//         this.rowDiv_.style.backgroundColor = this.colour_; // Background becomes category color
//         labelDom.style.color = 'white';                   // Text becomes white
//       } else {
//         this.rowDiv_.style.backgroundColor = 'transparent'; 
//         labelDom.style.color = this.colour_;               // Text returns to category color
//       }
//     }

//     // Keep the accessibility features working
//     Blockly.utils.aria.setState(this.htmlDiv_, Blockly.utils.aria.State.SELECTED, isSelected);
//   }
// }

// // Finally, Register the class
// Blockly.registry.register(
//     Blockly.registry.Type.TOOLBOX_ITEM,
//     Blockly.ToolboxCategory.registrationName,
//     EdusharksCategory, true
// );

class EdusharksCategory extends Blockly.ToolboxCategory {
  constructor(categoryDef, toolbox, opt_parent) {
    super(categoryDef, toolbox, opt_parent);
  }

 /** @override */
addColourBorder_(colour) {
  this.colour_ = colour; 
  if (this.rowDiv_) {
    // This variable is what the CSS :hover uses for the background!
    this.rowDiv_.style.setProperty('--category-hover-color', colour);

    const label = this.rowDiv_.querySelector('[class$="-label"]');
    const icon = this.rowDiv_.querySelector('[class^="customIcon"]');

    if (label) label.style.color = colour;
    if (icon) icon.style.color = colour;
  }
}

/** @override */
  setSelected(isSelected) {
    this.isSelected_ = isSelected;
    
    if (this.rowDiv_) {
      // Find the icon (class starts with customIcon)
      const icon = this.rowDiv_.querySelector('[class^="customIcon"]');
      // Find the label (class ends with -label)
      const label = this.rowDiv_.querySelector('[class$="-label"]');

      if (isSelected) {
        // Lock the active state
        this.rowDiv_.style.backgroundColor = this.colour_;
        if (label) label.style.setProperty('color', 'white', 'important');
        if (icon) icon.style.setProperty('color', 'white', 'important');
      } else {
        // Return to idle state
        this.rowDiv_.style.backgroundColor = 'transparent';
        if (label) label.style.setProperty('color', this.colour_, 'important');
        if (icon) icon.style.setProperty('color', this.colour_, 'important');
      }
    }

    super.setSelected(isSelected);
  }

}


// Register the class
Blockly.registry.register(
    Blockly.registry.Type.TOOLBOX_ITEM,
    Blockly.ToolboxCategory.registrationName,
    EdusharksCategory, true
);



class EdusharksHeader extends EdusharksCategory {
  /**
   * Override onClick to do absolutely nothing.
   * This prevents the flyout from opening.
   * @override
   */
  onClick(e) {
    // Do not call super.onClick(e)
    // This stops the "click" from happening
  }

  /**
   * Override setSelected to prevent the "active" look.
   * @override
   */
  setSelected(isSelected) {
    // We ignore the isSelected state and keep it in a "default" look
    var labelDom = this.rowDiv_.getElementsByClassName('blocklyToolboxCategoryLabel')[0];
    if (labelDom) {
      labelDom.style.color = 'white'; // Keep it white always
      labelDom.style.fontWeight = 'bold';
      labelDom.style.fontSize = '14px';
    }
    this.rowDiv_.style.backgroundColor = 'transparent';
    this.rowDiv_.style.cursor = 'default'; // Changes pointer to a normal arrow
  }

    /** @override - Disable hover start */
  onMouseEnter_(e) {
    // By leaving this empty, we prevent the "blocklyTreeRowHover" class
  }

  /** @override - Disable hover end */
  onMouseLeave_(e) {
    // Do nothing
  } 

}

Blockly.registry.register(
  Blockly.registry.Type.TOOLBOX_ITEM,
  'edusharks-header', // We give it a unique internal name
  EdusharksHeader
);

