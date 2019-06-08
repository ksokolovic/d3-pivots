let data = [];

let categories = ['Category 1', 'Category 2', 'Category 3'];
let subcategories = ['Subcategory 1', 'Subcategory 2'];
let years = [2018, 2019];
let genders = ['Male', 'Female'];
let countries = ['USA', 'Serbia'];

for (const category of categories) {
    for (const subcategory of subcategories) {
        for (const year of years) {
            for (const country of countries) {
                for (const gender of genders) {
                    data.push({
                        category: category,
                        subcategory: subcategory,
                        year: year,
                        gender: gender,
                        country: country,
                        value: Math.random() * 100 + 1
                    });
                }
            }
        }
    }
}