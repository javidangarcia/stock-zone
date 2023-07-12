export const formatDate = (dateString) => {
    const options = { day: "numeric", month: "long", year: "numeric" };
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", options);
};

export const capitalize = (word) => {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
};

export const firstWord = (string) => {
    return string.split(" ")[0];
}