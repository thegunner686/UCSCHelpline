export function deepEqual(object1, object2) {
    const keys1 = Object.keys(object1);
    const keys2 = Object.keys(object2);
    
    if (keys1.length !== keys2.length) {
        return false;
    }
    
    for (const key of keys1) {
        const val1 = object1[key];
        const val2 = object2[key];
        const areObjects = isObject(val1) && isObject(val2);
        if (areObjects && !deepEqual(val1, val2) || !areObjects && val1 !== val2) {
            return false;
        }
    }
    
    return true;
}

export function isObject(object) {
    return object != null && typeof object === 'object';
}

export function formattedDateFromMilli(milli) {
    return (new Date(milli)).toLocaleString()
}

export function getIconForCategory(category) {
    let iconName = "", iconType = "";
    switch(category) {
        case "NavigateIntent":
            iconName = "map-marked-alt";
            iconType = "font-awesome-5";
            break;
        case "SolveIntent":
            iconName = "account-search";
            iconType = "material-community";
            break;
        case "ReportIntent":
            iconName = "report";
            iconType = "material";
            break;
        case "DebugIntent":
            iconName = "bug-outline";
            iconType = "material-community";
            break;
        case "HelpIntent":
            iconName = "help";
            iconType = "entypo";
            break;
        default:
            iconName = "error"
            iconType="material"
            break;
    }
    return {
        iconName,
        iconType
    };
}