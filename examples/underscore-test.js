data = [];

let categories = ['Category 1', 'Category 2', 'Category 3'];
let subcategories = ['Subcategory 1', 'Subcategory 2'];
let years = [2018, 2019];
let quartals = ['Q1', 'Q2', 'Q3', 'Q4'];
let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

let quartalsToMonthsMapping = {
    'Q1': ['Jan', 'Feb', 'Mar'],
    'Q2': ['Apr', 'May', 'Jun'],
    'Q3': ['Jul', 'Aug', 'Sep'],
    'Q4': ['Oct', 'Nov', 'Dec']
};

let meta = {
    columns: {
        groupBy: ['category', 'subcategory', 'year', 'quartal', 'month'],
    },
    rows: {
        groupBy: undefined
    }
}

for (const category of categories) {
    for (const subcategory of subcategories) {
        for (const year of years) {
            for (const quartal of quartals) {
                for (const month of months) {
                    if (!quartalsToMonthsMapping[quartal].includes(month)) {
                        continue;
                    }

                    data.push({
                        category: category,
                        subcategory: subcategory,
                        year: year,
                        quartal: quartal,
                        month: month,
                        value: Math.random() * 100 + 1
                    });
                }
            }
        }
    }
}

console.log(data);

// New code
const makeRepeated = (arr, repeats) => [].concat(...Array.from({ length: repeats }, () => arr));

let unique = {};
for (const group of meta.columns.groupBy) {
    unique[group] = _.unique(data, group).map(unique => unique[group]);
}

let labels = [];
labels.push(unique[meta.columns.groupBy[0]]);
for (let i = 1; i < meta.columns.groupBy.length - 1; ++i) {
    let group = meta.columns.groupBy[i];
    labels.push(makeRepeated(unique[group], labels[i -1].length));
}
labels.push(makeRepeated(unique[meta.columns.groupBy[meta.columns.groupBy.length - 1]], data.length / unique[meta.columns.groupBy[meta.columns.groupBy.length - 1]].length));

for (let i = labels.length - 1; i >= 0; --i) {
    console.log(labels[i]);
}

// End new code

// labels.push(makeRepeated(subcategories, uniqueCategories.length));
// labels.push(makeRepeated(uniqueYears, uniqueCategories.length * uniqueSubcategories.length));
// labels.push(makeRepeated(uniqueQuartals, uniqueYears.length * uniqueSubcategories.length * uniqueCategories.length));
// labels.push(makeRepeated(uniqueMonths, data.length / uniqueMonths.length));

// let keys = ['year', 'quartal', 'month', 'value'];
// let pivots = ['year', 'quartal'];

// function groupByKeys(keys) {
//     let groups = _.groupBy(data, function(value) {
//         return keys.map(key => value[key]).join('|');
//     });

//     return groups;
// }

// let groups = groupByKeys(meta.columns.groupBy);

// for (const group in groups) {
//     let sampleGroup = groups[group];
//     for (let i = 0; i < sampleGroup.length; ++i) {
//         console.log(sampleGroup[i].month);
//     }
//     break;
// }


// groupedData = _.map(groups, function(group) {
//     let object = {};
    
//     for (const key of meta.keys) {
//         if (meta.columns.groupBy.includes(key)) {
//             object[key] = group[0][key];
//         } else {
//             object[key] = _.pluck(group, key);
//         }
//     }

//     return object;
// });

// let sample = {
//     categories: 3,
//     subcategoriesPerCategory: 2,
//     yearsPerSubcategory: 2,
//     quartalsPerYear: 4,
//     monthsPerQuartal: 3
// }