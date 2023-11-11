const MAP_TYPES = {
    NONE : 0,
	HEAT_MAP: 1,
	POINT_MAP: 2,
	SYMBOL_MAP: 3,
	CHOROPLETH_MAP: 4,
    FLOW_MAP: 5
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