const MAP_TYPES = {
    'NONE' : 0,
	'HEATMAP': 1,
	'POINT': 2,
	'SYMBOL': 3,
	'CHOROPLETH': 4,
    'FLOW': 5
}

//Index cooresponds with MAP_TYPES
const STRING_MAPPING = 
[ 	'NONE',
    'Heatmap',
    'Point/Locator',
    'Symbol',
    'Choropleth',
    'Flow'
]




export {MAP_TYPES, STRING_MAPPING}