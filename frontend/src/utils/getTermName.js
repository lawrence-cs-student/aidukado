

export const getTermName = (term) => {
    let termName = "";
    switch (term) {
        case 1:
            termName = "Prelim";
            break;
        case 2:
            termName = "Midterm";
            break;
        case 3:
            termName = "Finals";
            break;
    }
    return termName;
}