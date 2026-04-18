class EdusharksCategory extends Blockly.ToolboxCategory {
  constructor(categoryDef, toolbox, opt_parent) {
    super(categoryDef, toolbox, opt_parent);
  }

  /** @override */
  addColourBorder_(colour) {
    this.colour_ = colour; 
    const label = this.rowDiv_.querySelector('[class$="-label"]');
    const icon = this.rowDiv_.querySelector('[class^="customIcon"]');

    if (this.htmlDiv_) {
      this.htmlDiv_.style.setProperty('--category-hover-color', colour, 'important');
      
    }
    if (this.rowDiv_) {
      this.rowDiv_.style.setProperty('border-left', `8px solid ${colour}`, 'important');
      this.rowDiv_.style.setProperty('background-color', 'transparent', 'important');

      if (label) label.style.color = colour;
      
      if (icon) {
        const iconName = icon.className.replace('customIcon', '').toLowerCase();
        const iconPath = `assets/icons/${iconName}-icon.svg`;
        
        icon.style.webkitMaskImage = `url('${iconPath}')`;
        icon.style.maskImage = `url('${iconPath}')`;
        icon.style.backgroundImage = 'none';
        // Set initial icon color
        icon.style.setProperty('background-color', colour, 'important');
      }
    }
  }

  /** @override */
  setSelected(isSelected) {
    console.log(`Category: ${this.name_} | isSelected: ${isSelected}`);
    this.isSelected_ = isSelected;
    const icon = this.rowDiv_?.querySelector('[class^="customIcon"]');
    const label = this.rowDiv_?.querySelector('[class$="-label"]');

    if (this.rowDiv_) {
      if (isSelected) {
        this.rowDiv_.style.setProperty('background-color', this.colour_, 'important');
        if (label) label.style.setProperty('color', 'white', 'important');
        if (icon) icon.style.setProperty('background-color', 'white', 'important');
      } 
      
      else {
        // this.rowDiv_.style.display = 'none'; // This will make the category disappear
        this.rowDiv_.style.setProperty('background-color', this.colour_, 'important');
        if (label) label.style.setProperty('color', this.colour_);
        if (icon) icon.style.setProperty('background-color', this.colour_);
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

