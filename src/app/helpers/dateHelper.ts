export function convertToDateString(dateObject: Date){
    var dd = String(dateObject.getDate()).padStart(2, '0');
    var mm = String(dateObject.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = dateObject.getFullYear();

    var dateString = yyyy + '-' + mm + '-' + dd;
    return dateString;
}
