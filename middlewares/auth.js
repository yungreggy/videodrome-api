const jwt = require("jsonwebtoken");
const db = require("../config/db.js");

const auth = async (req, res, next) => {
    try {
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
            const jeton= req.headers.authorization.split(" ")[1];
            const jetonDecode = jwt.verify(jeton, process.env.JWT_SECRET);

            const utilisateurVerifie = await db.collection("utilisateurs").doc(jetonDecode.id).get();

            if (utilisateurVerifie.exists) {
                const utilisateurRecupere = utilisateurVerifie.data();
                req.utilisateur = utilisateurRecupere;
                next();
              
            } else {
                throw new Error("Non autorisé");
            }

        } else {
            throw new Error("Non autorisé");
            
        }
    } catch (error) {
        res.statusCode = 401;
        res.json({ message: "Non autorisé" });
    }
};

module.exports = auth;
