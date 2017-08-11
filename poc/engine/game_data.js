export const gameJson = {  
   "name":"Text Adventure Game Configuration",
   "version":"1.0",
   "locations": {
      "l1":{
         "state":"default",
         "texts":{  
            "default":"l1 location text",
            "modified":"l1 modified location text",
            "non-response":"please try again"
         },
         "criteria":{  
            "success":[  
               "good",
               "great"
            ],
            "fail":[  
               "false",
               "negative"
            ]
         },
         "links":{  
            "success": { 
               "target_id":"l2",
               "text":"to l2",
               "state":"default",
            },
            "fail":{
               "target_id":"l3",
               "text":"to l3",
               "state":"default",
         }
        }
      },
      "l2": {
         "state":"default",
         "texts":{  
            "default":"l1 location text",
            "modified":"l1 modified location text",
            "non-response":"please try again"
         },
         "criteria":{  
            "success":[  
               "cat",
               "cats"
            ],
            "fail":[  
               "dog",
               "dogs"
            ]
         },
         "links": {
           "success": {  
               "target_id":"l4",
               "text":"to l2",
               "state":"default"
            },
            "fail":{ 
               "target_id":"l5",
               "text":"to l2",
               "state":"default",
            }
         }
      },
      "l3": {
         "state":"default",
         "texts":{  
            "default":"l1 location text",
            "modified":"l1 modified location text",
            "non-response":"please try again"
         },
         "criteria":{  
            "success":[  
               "pizza",
               "pasta"
            ],
            "fail":[  
               "tacos",
               "torta"
            ]
         },
         "links":{
            "success": {  
               "target_id":"l6",
               "text":"to l2",
               "state":"default"
            },
            "fail":{  
               "target_id":"l7",
               "text":"to l2",
               "state":"default"
            }
         }
      },
      "l4": {
         "state":"default",
         "texts":{  
            "default":"l1 location text",
            "modified":"l1 modified location text",
            "non-response":"please try again"
         },
         "criteria":{  
            "success":[  
               "republican",
               "donkey"
            ],
            "fail":[  
               "democrat",
               "elephant"
            ]
         },
         "links": {
            "success": {  
               "target_id":"l6",
               "text":"to l2",
               "state":"default"
            },
            "fail": {  
               "target_id":"l3",
               "text":"to l2",
               "state":"default"
            }
         }
      },
      "l5": {
         "state":"default",
         "texts":{  
            "default":"l1 location text",
            "modified":"l1 modified location text",
            "non-response":"please try again"
         },
         "criteria":{  
            "success":[  
               "Houston",
               "Texas"
            ],
            "fail":[  
               "Nashville",
               "Tennesee"
            ]
         },
         "links":{
            "success": {  
               "target_id":"l2",
               "text":"to l2",
               "state":"default",
            },
            "fial": {  
               "target_id":"l7",
               "text":"to l2",
               "state":"default",
            }
         }
      },
      "l6": {
         "state":"default",
         "texts":{  
            "default":"l1 location text",
            "modified":"l1 modified location text",
            "non-response":"please try again"
         },
         "criteria": {  
            "success":[  
               "green",
               "blue"
            ],
            "fail":[  
               "white",
               "black"
            ]
         },
         "links":{
            "success": {  
               "target_id":"l1",
               "text":"to l2",
               "state":"default",
            },
            "fail": {  
               "target_id":"l7",
               "text":"to l2",
               "state":"default"
            }
        }
      },
      "l7": {
         "state":"default",
         "texts":{  
            "default":"l1 location text",
            "modified":"l1 modified location text",
            "non-response":"please try again"
         },
         "criteria":{  
            "success":[  
               "knights",
               "warrirors"
            ],
            "fail":[  
               "witches",
               "goblins"
            ]
         },
         "links":{}
      }
   },
   "player":{  
      "location_id":"l1"
   }
}