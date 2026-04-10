const toolboxCategories = {
  kind: 'categoryToolbox',  
  contents: [

    { kind: 'edusharks-header',
    name: 'TOOL BOX',
    cssConfig:{      
      "row": 'edusharks-header-row',
      "icon": 'blocklyToolboxCategoryIcon',
      'label': 'edusharks-header-label'
    }       
 
    },

    // {kind: 'sep'},

    { kind: 'category',
      name: 'Controls',
      cssConfig:{
        "icon": 'customIconControls',
        "label": 'controls-label' },
 
      contents: [
        {
          type: 'base_start',
          kind: 'block',
        },
        {
          type: 'base_forever',
          kind: 'block',
        },

        { kind: "block", 
          type: "base_delay",
        }
          ,]
    },
    { kind: 'category',
      name: 'Hardware',
      categorystyle: 'hardware_category',
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
    { kind: 'category',
      name: 'Logic',
      cssConfig:{
        "icon": 'customIconLogic',
        "label": 'logic-label'      
      },

      contents: [
        {
          type: 'controls_if',
          kind: 'block',
        },
        {
          type: 'logic_compare',
          kind: 'block',
          fields: {
            OP: 'EQ',
          },
        },
        {
          type: 'logic_operation',
          kind: 'block',
          fields: {
            OP: 'AND',
          },
        },
        {
          type: 'logic_negate',
          kind: 'block',
        },
        {
          type: 'logic_boolean',
          kind: 'block',
          fields: {
            BOOL: 'TRUE',
          },
        },
        {
          type: 'logic_null',
          kind: 'block',
          enabled: false,
        },
        {
          type: 'logic_ternary',
          kind: 'block',
        },
      ],
    },
    { kind: 'category',
      name: 'Loops',
      categorystyle: 'loop_category', 
      cssConfig:{
          "icon": 'customIconLoops',
          "label": 'loops-label' },
 
      contents: [
        {
          type: 'controls_repeat_ext',
          kind: 'block',
          inputs: {
            TIMES: {
              shadow: {
                type: 'math_number',
                fields: {
                  NUM: 10,
                },
              },
            },
          },
        },
        {
          type: 'controls_repeat',
          kind: 'block',
          enabled: false,
          fields: {
            TIMES: 10,
          },
        },
        {
          type: 'controls_whileUntil',
          kind: 'block',
          fields: {
            MODE: 'WHILE',
          },
        },
        {
          type: 'controls_for',
          kind: 'block',
          fields: {
            VAR: {
              name: 'i',
            },
          },
          inputs: {
            FROM: {
              shadow: {
                type: 'math_number',
                fields: {
                  NUM: 1,
                },
              },
            },
            TO: {
              shadow: {
                type: 'math_number',
                fields: {
                  NUM: 10,
                },
              },
            },
            BY: {
              shadow: {
                type: 'math_number',
                fields: {
                  NUM: 1,
                },
              },
            },
          },
        },
        {
          type: 'controls_forEach',
          kind: 'block',
          fields: {
            VAR: {
              name: 'j',
            },
          },
        },
        {
          type: 'controls_flow_statements',
          kind: 'block',
          enabled: false,
          fields: {
            FLOW: 'BREAK',
          },
        },
      ],
    },
    { kind: 'category',
      name: 'Math',
      categorystyle: 'math_category',
      cssConfig:{
          "icon": 'customIconMath',
          "label": 'math-label' },
      contents: [
        {
          type: 'math_number',
          kind: 'block',
          fields: {
            NUM: 100,
          },
        },
        {
          type: 'math_arithmetic',
          kind: 'block',
          fields: {
            OP: 'ADD',
          },
          inputs: {
            A: {
              shadow: {
                type: 'math_number',
                fields: {
                  NUM: 1,
                },
              },
            },
            B: {
              shadow: {
                type: 'math_number',
                fields: {
                  NUM: 1,
                },
              },
            },
          },
        },
        {
          type: 'math_single',
          kind: 'block',
          fields: {
            OP: 'ROOT',
          },
          inputs: {
            NUM: {
              shadow: {
                type: 'math_number',
                fields: {
                  NUM: 9,
                },
              },
            },
          },
        },
        {
          type: 'math_trig',
          kind: 'block',
          fields: {
            OP: 'SIN',
          },
          inputs: {
            NUM: {
              shadow: {
                type: 'math_number',
                fields: {
                  NUM: 45,
                },
              },
            },
          },
        },
        {
          type: 'math_constant',
          kind: 'block',
          fields: {
            CONSTANT: 'PI',
          },
        },
        {
          type: 'math_number_property',
          kind: 'block',
          fields: {
            PROPERTY: 'EVEN',
          },
          inputs: {
            NUMBER_TO_CHECK: {
              shadow: {
                type: 'math_number',
                fields: {
                  NUM: 0,
                },
              },
            },
          },
        },
        {
          type: 'math_round',
          kind: 'block',
          fields: {
            OP: 'ROUND',
          },
          inputs: {
            NUM: {
              shadow: {
                type: 'math_number',
                fields: {
                  NUM: 3.1,
                },
              },
            },
          },
        },
        {
          type: 'math_on_list',
          kind: 'block',
          fields: {
            OP: 'SUM',
          },
        },
        {
          type: 'math_modulo',
          kind: 'block',
          inputs: {
            DIVIDEND: {
              shadow: {
                type: 'math_number',
                fields: {
                  NUM: 64,
                },
              },
            },
            DIVISOR: {
              shadow: {
                type: 'math_number',
                fields: {
                  NUM: 10,
                },
              },
            },
          },
        },
        {
          type: 'math_constrain',
          kind: 'block',
          inputs: {
            VALUE: {
              shadow: {
                type: 'math_number',
                fields: {
                  NUM: 50,
                },
              },
            },
            LOW: {
              shadow: {
                type: 'math_number',
                fields: {
                  NUM: 1,
                },
              },
            },
            HIGH: {
              shadow: {
                type: 'math_number',
                fields: {
                  NUM: 100,
                },
              },
            },
          },
        },
        {
          type: 'math_random_int',
          kind: 'block',
          inputs: {
            FROM: {
              shadow: {
                type: 'math_number',
                fields: {
                  NUM: 1,
                },
              },
            },
            TO: {
              shadow: {
                type: 'math_number',
                fields: {
                  NUM: 100,
                },
              },
            },
          },
        },
        {
          type: 'math_random_float',
          kind: 'block',
        },
        {
          type: 'math_atan2',
          kind: 'block',
          inputs: {
            X: {
              shadow: {
                type: 'math_number',
                fields: {
                  NUM: 1,
                },
              },
            },
            Y: {
              shadow: {
                type: 'math_number',
                fields: {
                  NUM: 1,
                },
              },
            },
          },
        },
      ],
    },    
    { kind: 'category',
      name: 'Variables',
      custom: 'VARIABLE',
      categorystyle: 'variable_category',
      cssConfig:{
          "icon": 'customIconVariable',
          "label": 'variable-label' },
    },
    // { kind: 'sep'},

    {
    kind: 'category',
    name: 'Extensions', // This name MUST match the string in the listener above
    cssConfig: { 
        "icon": 'customIconExtensions', 
        "label": 'extensions-label' 
    },
    contents: [] // Keep this empty so no flyout appears
    },    
    
    { kind: 'category',
      name: 'Advanced', // The Parent Category
      categorystyle: 'procedure_category',
      expanded: 'false', // Keeps it closed by default
      cssConfig: {
                    "container": 'advanced-category-container', // Styles the whole group
                    "row": 'advanced-parent-row',             // Styles just the 'Advanced' label row
                    "icon": 'customIconAdvanced',
                    "label": 'advanced-label'
          },
      contents: [
                  { kind: 'category',
                    name: 'Functions',
                    custom: 'PROCEDURE',
                    categorystyle: 'procedure_category',
                    cssConfig:{
                        "icon": 'customIconFunctions',
                        "label": 'functions-label' },
                  },
                  { kind: 'category',
                    name: 'Text',
                    categorystyle: 'text_category',
                    cssConfig:{
                        "icon": 'customIconText',
                        "label": 'text-label' },
                    contents: [
                      {
                        type: 'text',
                        kind: 'block',
                        fields: {
                          TEXT: '',
                        },
                      },
                      {
                        type: 'text_join',
                        kind: 'block',
                      },
                      {
                        type: 'text_append',
                        kind: 'block',
                        fields: {
                          name: 'item',
                        },
                        inputs: {
                          TEXT: {
                            shadow: {
                              type: 'text',
                              fields: {
                                TEXT: '',
                              },
                            },
                          },
                        },
                      },
                      {
                        type: 'text_length',
                        kind: 'block',
                        inputs: {
                          VALUE: {
                            shadow: {
                              type: 'text',
                              fields: {
                                TEXT: 'abc',
                              },
                            },
                          },
                        },
                      },
                      {
                        type: 'text_isEmpty',
                        kind: 'block',
                        inputs: {
                          VALUE: {
                            shadow: {
                              type: 'text',
                              fields: {
                                TEXT: '',
                              },
                            },
                          },
                        },
                      },
                      {
                        type: 'text_indexOf',
                        kind: 'block',
                        fields: {
                          END: 'FIRST',
                        },
                        inputs: {
                          VALUE: {
                            block: {
                              type: 'variables_get',
                              fields: {
                                VAR: {
                                  name: 'text',
                                },
                              },
                            },
                          },
                          FIND: {
                            shadow: {
                              type: 'text',
                              fields: {
                                TEXT: 'abc',
                              },
                            },
                          },
                        },
                      },
                      {
                        type: 'text_charAt',
                        kind: 'block',
                        fields: {
                          WHERE: 'FROM_START',
                        },
                        inputs: {
                          VALUE: {
                            block: {
                              type: 'variables_get',
                              fields: {
                                VAR: {
                                  name: 'text',
                                },
                              },
                            },
                          },
                        },
                      },
                      {
                        type: 'text_getSubstring',
                        kind: 'block',
                        fields: {
                          WHERE1: 'FROM_START',
                          WHERE2: 'FROM_START',
                        },
                        inputs: {
                          STRING: {
                            block: {
                              type: 'variables_get',
                              fields: {
                                VAR: {
                                  name: 'text',
                                },
                              },
                            },
                          },
                        },
                      },
                      {
                        type: 'text_changeCase',
                        kind: 'block',
                        fields: {
                          CASE: 'UPPERCASE',
                        },
                        inputs: {
                          TEXT: {
                            shadow: {
                              type: 'text',
                              fields: {
                                TEXT: 'abc',
                              },
                            },
                          },
                        },
                      },
                      {
                        type: 'text_trim',
                        kind: 'block',
                        fields: {
                          MODE: 'BOTH',
                        },
                        inputs: {
                          TEXT: {
                            shadow: {
                              type: 'text',
                              fields: {
                                TEXT: 'abc',
                              },
                            },
                          },
                        },
                      },
                      {
                        type: 'text_count',
                        kind: 'block',
                        inputs: {
                          SUB: {
                            shadow: {
                              type: 'text',
                              fields: {
                                TEXT: '',
                              },
                            },
                          },
                          TEXT: {
                            shadow: {
                              type: 'text',
                              fields: {
                                TEXT: '',
                              },
                            },
                          },
                        },
                      },
                      {
                        type: 'text_replace',
                        kind: 'block',
                        inputs: {
                          FROM: {
                            shadow: {
                              type: 'text',
                              fields: {
                                TEXT: '',
                              },
                            },
                          },
                          TO: {
                            shadow: {
                              type: 'text',
                              fields: {
                                TEXT: '',
                              },
                            },
                          },
                          TEXT: {
                            shadow: {
                              type: 'text',
                              fields: {
                                TEXT: '',
                              },
                            },
                          },
                        },
                      },
                      {
                        type: 'text_reverse',
                        kind: 'block',
                        inputs: {
                          TEXT: {
                            shadow: {
                              type: 'text',
                              fields: {
                                TEXT: '',
                              },
                            },
                          },
                        },
                      },

                      {
                        type: 'text_print',
                        kind: 'block',
                        inputs: {
                          TEXT: {
                            shadow: {
                              type: 'text',
                              fields: {
                                TEXT: 'abc',
                              },
                            },
                          },
                        },
                      },
                      {
                        type: 'text_prompt_ext',
                        kind: 'block',
                        fields: {
                          TYPE: 'TEXT',
                        },
                        inputs: {
                          TEXT: {
                            shadow: {
                              type: 'text',
                              fields: {
                                TEXT: 'abc',
                              },
                            },
                          },
                        },
                      },
                    ],
                  },
                  { kind: 'category',
                    name: 'Lists',
                    categorystyle: 'list_category',
                    cssConfig:{
                        "icon": 'customIconLists',
                        "label": 'lists-label' },
                    contents: [
                      {
                        type: 'lists_create_with',
                        kind: 'block',
                        extraState: {
                          itemCount: 0,
                        },
                      },
                      {
                        type: 'lists_create_with',
                        kind: 'block',
                      },
                      {
                        type: 'lists_repeat',
                        kind: 'block',
                        inputs: {
                          NUM: {
                            shadow: {
                              type: 'math_number',
                              fields: {
                                NUM: 5,
                              },
                            },
                          },
                        },
                      },
                      {
                        type: 'lists_length',
                        kind: 'block',
                      },
                      {
                        type: 'lists_isEmpty',
                        kind: 'block',
                      },
                      {
                        type: 'lists_indexOf',
                        kind: 'block',

                        fields: {
                          END: 'FIRST',
                        },
                        inputs: {
                          VALUE: {
                            block: {
                              type: 'variables_get',
                              fields: {
                                VAR: {
                                  name: 'list',
                                },
                              },
                            },
                          },
                        },
                      },
                      {
                        type: 'lists_getIndex',
                        kind: 'block',
                        fields: {
                          MODE: 'GET',
                          WHERE: 'FROM_START',
                        },
                        inputs: {
                          VALUE: {
                            block: {
                              type: 'variables_get',
                              fields: {
                                VAR: {
                                  name: 'list',
                                },
                              },
                            },
                          },
                        },
                      },
                      {
                        type: 'lists_setIndex',
                        kind: 'block',
                        fields: {
                          MODE: 'SET',
                          WHERE: 'FROM_START',
                        },
                        inputs: {
                          LIST: {
                            block: {
                              type: 'variables_get',
                              fields: {
                                VAR: {
                                  name: 'list',
                                },
                              },
                            },
                          },
                        },
                      },
                      {
                        type: 'lists_getSublist',
                        kind: 'block',
                        fields: {
                          WHERE1: 'FROM_START',
                          WHERE2: 'FROM_START',
                        },
                        inputs: {
                          LIST: {
                            block: {
                              type: 'variables_get',
                              fields: {
                                VAR: {
                                  name: 'list',
                                },
                              },
                            },
                          },
                        },
                      },
                      {
                        type: 'lists_split',
                        kind: 'block',

                        fields: {
                          MODE: 'SPLIT',
                        },
                        inputs: {
                          DELIM: {
                            shadow: {
                              type: 'text',
                              fields: {
                                TEXT: ',',
                              },
                            },
                          },
                        },
                      },
                      {
                        type: 'lists_sort',
                        kind: 'block',

                        fields: {
                          TYPE: 'NUMERIC',
                          DIRECTION: '1',
                        },
                      },
                      {
                        type: 'lists_reverse',
                        kind: 'block',
                      },
                    ],
                  }        
    
  ],
    }


]
}