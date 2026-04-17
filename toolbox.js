const toolboxCategories = {
  kind: 'categoryToolbox',  
  contents: [

    { name: 'TOOL BOX',
      kind: 'edusharks-header',      
      cssConfig:{      
        "row": 'edusharks-header-row',
        "icon": 'blocklyToolboxCategoryIcon',
        'label': 'edusharks-header-label'
      } 
    },

    { name: 'Search',
      kind: 'search',      
      contents: [] // The plugin fills this automatically
    },

    { name: 'Controls',
      kind: 'category',      
      colour: '#00D0FF', // Deep Purple
      cssConfig:{
        "icon": 'customIconControls',
        "label": 'controls-label' },  // Custom color for this category       
 
      contents: [
        { kind: 'block', type: 'base_start'},
        { kind: 'block', type: 'base_forever'},
        { kind: "block", type: "base_delay"}
      ]
    },

    { name: 'Hardware',
      kind: 'category',      
      colour: '#92A45B', // Deep Purple
      // categorystyle: 'hardware_category',
      cssConfig:{
          "icon": 'customIconHardware',
          "label": 'hardware-label' },

      contents: [
            { 'kind': 'block', 'type': 'esp32_led' },
            { 'kind': 'block', 'type': 'sensor_ultrasonic' },
            { 'kind': 'block', 'type': 'sensor_dht11' },
            { 'kind': 'block', 'type': 'sensor_ldr' }          
       ],
    },

    { name: 'Logic',
      kind: 'category',      
      colour: '#00a4a6', 
      cssConfig:{
        "icon": 'customIconLogic',
        "label": 'logic-label'      
      },
      contents: [
        { kind: 'block', type: 'controls_if'},
        { kind: 'block', type: 'logic_compare', fields: { OP: 'EQ'}},
        { kind: 'block', type: 'logic_operation', fields: {OP: 'AND'}},
        { kind: 'block', type: 'logic_negate'},
        { kind: 'block', type: 'logic_boolean', fields: {BOOL: 'TRUE'}},
        { kind: 'block', type: 'logic_null', enabled: false },
        { kind: 'block', type: 'logic_ternary'}
      ],
    },

    { name: 'Loops',
      kind: 'category',      
      colour: '#00AA00', 
      // categorystyle: 'loop_category', 
      cssConfig:{
          "icon": 'customIconLoops',
          "label": 'loops-label' },
 
      contents: [
        { kind: 'block', type: 'controls_repeat_ext', inputs: { TIMES: { shadow: { type: 'math_number', fields: { NUM: 10 } } } }  },        
        { kind: 'block', type: 'controls_whileUntil', fields: { MODE: 'WHILE' } },
        { kind: 'block', type: 'controls_for', fields: { VAR: { name: 'i' } }, inputs: { FROM: { shadow: { type: 'math_number', fields: { NUM: 1 } } }, TO: { shadow: { type: 'math_number', fields: { NUM: 10 } } }, BY: { shadow: { type: 'math_number', fields: { NUM: 1 } } } } },
        { kind: 'block', type: 'controls_forEach', fields: { VAR: { name: 'j' } } },
        { kind: 'block', type: 'controls_flow_statements', enabled: true, fields: { FLOW: 'BREAK' } }
      ],
    },

    { name: 'Math',
      kind: 'category',      
      colour: '#9300D2', 
      // categorystyle: 'math_category',
      cssConfig:{
          "icon": 'customIconMath',
          "label": 'math-label'},
      contents: [
        { kind: 'block', type: 'math_number', fields: { NUM: 100 } },
        { kind: 'block', type: 'math_arithmetic', fields: { OP: 'ADD' }, inputs: { A: { shadow: { type: 'math_number', fields: { NUM: 1 } } }, B: { shadow: { type: 'math_number', fields: { NUM: 1 } } } } },
        { kind: 'block', type: 'math_single', fields: { OP: 'ROOT'}, inputs: { NUM: { shadow: { type: 'math_number', fields: { NUM: 9 } } } } },
        { kind: 'block', type: 'math_trig', fields: { OP: 'SIN' }, inputs: { NUM: { shadow: { type: 'math_number', fields: { NUM: 45 } } } } },
        { kind: 'block', type: 'math_constant', fields: { CONSTANT: 'PI' } },
        { kind: 'block', type: 'math_number_property', fields: { PROPERTY: 'EVEN' }, inputs: { NUMBER_TO_CHECK: { shadow: { type: 'math_number', fields: { NUM: 0 } } } } },
        { kind: 'block', type: 'math_round', fields: { OP: 'ROUND' }, inputs: { NUM: { shadow: { type: 'math_number', fields: { NUM: 3.1 } } } } },
        { kind: 'block', type: 'math_on_list', fields: { OP: 'SUM' } },
        { kind: 'block', type: 'math_modulo', inputs: {  DIVIDEND: { shadow: { type: 'math_number', fields: { NUM: 64 } } }, DIVISOR: { shadow: { type: 'math_number', fields: { NUM: 10 } } } } },
        { kind: 'block', type: 'math_constrain', inputs: { VALUE: { shadow: { type: 'math_number', fields: { NUM: 50 } } }, LOW: { shadow: { type: 'math_number', fields: { NUM: 1 } } }, HIGH: { shadow: { type: 'math_number', fields: { NUM: 100 } } } } },
        { kind: 'block', type: 'math_random_int', inputs: { FROM: { shadow: { type: 'math_number', fields: { NUM: 1 } } }, TO: { shadow: { type: 'math_number', fields: { NUM: 100 } } } } },
        { kind: 'block', type: 'math_random_float' },
        { kind: 'block', type: 'math_atan2', inputs: { X: { shadow: { type: 'math_number', fields: {  NUM: 1 } } }, Y: { shadow: { type: 'math_number', fields: { NUM: 1 } } } } },
      ],
    },

    { name: 'Variables',
      kind: 'category',      
      colour: '#A45A80',
      custom: 'VARIABLE',      
      // categorystyle: 'variable_category',
      cssConfig:{
          "icon": 'customIconVariable',
          "label": 'variable-label'},
    }, 
    
    { name: 'ADVANCED',
      kind: 'category',
      colour: '#e5e230',
      // categorystyle: 'procedure_category',
      expanded: 'false', // Keeps it closed by default
      cssConfig: {
                    "container": 'advanced-category-container', // Styles the whole group
                    "row": 'advanced-parent-row',             // Styles just the 'Advanced' label row
                    "icon": 'customIconAdvanced',
                    "label": 'advanced-label'
          },
      contents: [
                  { name: 'Functions',
                    kind: 'category',                    
                    custom: 'PROCEDURE',
                    categorystyle: 'procedure_category',
                    cssConfig:{
                        "icon": 'customIconFunctions',
                        "label": 'functions-label' },
                  },

                  { name: 'Text',
                    kind: 'category',                    
                    categorystyle: 'text_category',
                    cssConfig:{
                        "icon": 'customIconText',
                        "label": 'text-label' },
                    contents: [
                      { kind: 'block', type: 'text', fields: { TEXT: '' } },
                      { kind: 'block', type: 'text_join' },
                      { kind: 'block', type: 'text_append', fields: { name: 'item'}, inputs: { TEXT: { shadow: { type: 'text', fields: { TEXT: '' } } } } },
                      { kind: 'block', type: 'text_length', inputs: { VALUE: { shadow: { type: 'text', fields: { TEXT: 'abc' } } } } },
                      { kind: 'block', type: 'text_isEmpty',inputs: { VALUE: { shadow: { type: 'text', fields: { TEXT: '' } } } } },
                      { kind: 'block', type: 'text_indexOf',fields: { END: 'FIRST' }, inputs: { VALUE: { block: { type: 'variables_get', fields: { VAR: { name: 'text' } } } }, FIND: { shadow: { type: 'text', fields: { TEXT: 'abc' } } } } },
                      { kind: 'block', type: 'text_charAt', fields: { WHERE: 'FROM_START' }, inputs: { VALUE: { block: { type: 'variables_get', fields: { VAR: { name: 'text' } } } } } },
                      { kind: 'block', type: 'text_getSubstring', fields: { WHERE1: 'FROM_START',  WHERE2: 'FROM_START' }, inputs: { STRING: { block: { type: 'variables_get', fields: { VAR: { name: 'text' } } } } } },
                      { kind: 'block', type: 'text_trim', fields: { MODE: 'BOTH' }, inputs: { TEXT: { shadow: { type: 'text', fields: { TEXT: 'abc' } } } } },
                      { kind: 'block', type: 'text_count', inputs: { SUB: { shadow: { type: 'text', fields: { TEXT: '' } } }, TEXT: { shadow: { type: 'text', fields: { TEXT: '' } } } } },
                      { kind: 'block', type: 'text_replace', inputs: { FROM: { shadow: { type: 'text', fields: { TEXT: '' } } }, TO: {shadow: { type: 'text', fields: { TEXT: '' } } }, TEXT: { shadow: { type: 'text', fields: { TEXT: '' } } } } },
                      { kind: 'block', type: 'text_reverse', inputs: { TEXT: { shadow: { type: 'text', fields: { TEXT: '' } } } } },
                      { kind: 'block', type: 'text_print', inputs: { TEXT: { shadow: { type: 'text', fields: { TEXT: 'abc' } } } } },
                      { kind: 'block', type: 'text_prompt_ext', fields: { TYPE: 'TEXT' }, inputs: { TEXT: { shadow: { type: 'text', fields: { TEXT: 'abc' } } } } }
                    ],
                  },

                  { name: 'Lists',
                    kind: 'category',                    
                    colour: '#DB133B',
                    // categorystyle: 'list_category',
                    cssConfig:{
                        "icon": 'customIconLists',
                        "label": 'lists-label' },

                    contents: [
                      { kind: 'block', type: 'lists_create_with', extraState: { itemCount: 0 } },
                      { kind: 'block', type: 'lists_create_with' },
                      { kind: 'block', type: 'lists_repeat', inputs: { NUM: { shadow: { type: 'math_number', fields: { NUM: 5 } } } } },
                      { kind: 'block', type: 'lists_length' },
                      { kind: 'block', type: 'lists_isEmpty'},
                      { kind: 'block', type: 'lists_indexOf', fields: { END: 'FIRST' }, inputs: { VALUE: { block: { type: 'variables_get', fields: { VAR: { name: 'list' } } } } } },
                      { kind: 'block', type: 'lists_getIndex', fields: { MODE: 'GET', WHERE: 'FROM_START' }, inputs: { VALUE: { block: { type: 'variables_get', fields: { VAR: { name: 'list' } } } } } },
                      { kind: 'block', type: 'lists_setIndex', fields: { MODE: 'SET', WHERE: 'FROM_START' }, inputs: { LIST: { block: { type: 'variables_get', fields: { VAR: { name: 'list' } } } } } },
                      { kind: 'block', type: 'lists_getSublist', fields: { WHERE1: 'FROM_START', WHERE2: 'FROM_START' }, inputs: { LIST: { block: { type: 'variables_get', fields: { VAR: { name: 'list' } } } } } },
                      { kind: 'block', type: 'lists_split', fields: { MODE: 'SPLIT' }, inputs: { DELIM: { shadow: { type: 'text', fields: { TEXT: ',' } } } } },
                      { kind: 'block', type: 'lists_sort', fields: { TYPE: 'NUMERIC', DIRECTION: '1' } },
                      { kind: 'block', type: 'lists_reverse'}
                    ],
                  },
                  { name: 'Extensions', 
                      kind: 'category',
                      colour: '#15D0AC', 
                      cssConfig: { 
                          "icon": 'customIconExtensions', 
                          "label": 'extensions-label' 
                      },
                      contents: [

                      ] // Keep this empty so no flyout appears
                  },          
    
  ],
    }
 
  ]
}