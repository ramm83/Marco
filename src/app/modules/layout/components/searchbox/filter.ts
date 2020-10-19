export class Filter {
    constructor() {
    }

    public static SetFilteredData(value: string, data: any[]): any[] {
        const filterValue = value ? value.toLowerCase() : '';
        const filterBigGroups = [];
        if (!value) {
            return data;
        }

        data?.forEach((bigGroup) => {
            const filterGroups = [];
            bigGroup.children.forEach((group) => {
                const filterCollapses = [];
                group.children.forEach((collapse) => {
                    const filterItems = [];
                    collapse.children.forEach((item) => {
                        if (item.title.toLowerCase().includes(filterValue)) {
                            const newItem = item;
                            filterItems.push(newItem);
                        }
                    });

                    if (filterItems.length > 0) {
                        const newCollapse = collapse;
                        newCollapse.children = filterItems;
                        filterCollapses.push(newCollapse);
                    }
                });

                if (filterCollapses.length > 0) {
                    const newGroup = group;
                    newGroup.children = filterCollapses;
                    filterGroups.push(newGroup);
                }
            });

            if (filterGroups.length > 0) {
                const newGroup = bigGroup;
                newGroup.children = filterGroups;
                filterBigGroups.push(newGroup);
            }
        });

        return filterBigGroups;
    }
}
