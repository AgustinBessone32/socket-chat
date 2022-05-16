const { response } = require("express")


const esAdminRole = (req, res = response, next) => {

    if (!req.user) {
        return res.status(500).json({
            msg: 'Se quiere verificar el rol sin validar el token primero'
        })
    }

    const { role, name } = req.user

    if (role !== 'ADMIN') {
        return res.status(401).json({
            msg: `${name} no es admin - no puede realizar esto`
        })
    }

    next()
}


const tieneRole = (...roles) => {
    return (req, res = response, nex) => {

        if (!req.user) {
            return res.status(500).json({
                msg: 'Se quiere verificar el rol sin validar el token primero'
            })
        }

        if(!roles.includes(req.user.role)){
            return res.status(401).json({
                msg: `El servicio requiere alguno de estos roles: ${roles}`
            })
        }

        next()
    }
}

module.exports = {
    esAdminRole,
    tieneRole
}