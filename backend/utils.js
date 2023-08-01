// Functions

export const checkSession = (req, res, next) => {
    const { user } = req.session;
    if (user == null) {
        res.status(401).json({ error: "Missing Session." });
    } else {
        next();
    }
};

export function compareStocksByPoints(firstStock, secondStock) {
    return secondStock.points - firstStock.points;
}

// Constants

export const PROFILE_PICTURE =
    "https://t3.ftcdn.net/jpg/00/64/67/52/360_F_64675209_7ve2XQANuzuHjMZXP3aIYIpsDKEbF5dD.jpg";
