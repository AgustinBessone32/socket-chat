

const {Schema,model, SchemaTypes} = require('mongoose')


const ProductSchema = Schema({
    name:{
        type:String,
        required: [true, 'El nombre es obligatorio']
    },
    status:{
        type:Boolean,
        required: true,
        default: true
    },
    user:{
        type: SchemaTypes.ObjectId,
        ref: 'User',
        required: true
    },
    price:{
        type:Number,
        default: 0
    },
    category:{
        type: SchemaTypes.ObjectId,
        ref: 'Category',
        required: true
    },
    description:{
        type:String
    },
    available:{
        type: Boolean,
        default: true
    },
    img:{
        type: String
    }
})

ProductSchema.methods.toJSON = function(){
    const {__v,...data} = this.toObject()
    return data
}
module.exports = model('Product', ProductSchema)