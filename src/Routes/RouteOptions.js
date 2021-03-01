export const headerOptions = (props, changes, barOptions) => {
    let options = {
        headerTransparent: true,
        headerTitle: "",
        headerTitleStyle: {
            fontFamily: Fonts.standardFont,
            fontSize: Fonts.standardSize,
            color: Colors.darkBlue
        },
        headerLeft: () => LeftBar(props),
        headerRight: () => RightBar(props)
    };
    
    if(changes) {
        Object.entries(changes).map((change) => {
            options[change[0]] = change[1];
        });
    }

    return options;
}