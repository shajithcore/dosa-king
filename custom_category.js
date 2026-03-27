class EdusharksCategory extends Blockly.ToolboxCategory {
  constructor(categoryDef, toolbox, opt_parent) {
    super(categoryDef, toolbox, opt_parent);
  }

  /** @override - This removes the left color strip */
  addColourBorder_(colour) {
    // Left empty on purpose
  }

  /** @override - This handles the color swapping */
  setSelected(isSelected) {
    // Find the label Blockly created for us
    var labelDom = this.rowDiv_.getElementsByClassName('blocklyToolboxCategoryLabel')[0];
    
    if (labelDom) { // Safety check
      if (isSelected) {
        this.rowDiv_.style.backgroundColor = this.colour_; // Background becomes category color
        labelDom.style.color = 'white';                   // Text becomes white
      } else {
        this.rowDiv_.style.backgroundColor = 'transparent'; 
        labelDom.style.color = this.colour_;               // Text returns to category color
      }
    }

    // Keep the accessibility features working
    Blockly.utils.aria.setState(this.htmlDiv_, Blockly.utils.aria.State.SELECTED, isSelected);
  }
}

// Finally, Register the class
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

