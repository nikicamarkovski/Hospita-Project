const db = require('../database');

GetOrderQuery = (order) => {
    console.log(order)

     const query = 'insert into orders(date , type_of_drugs , order_quantity , drug_id) values (now(),?,?,?)';
    return new Promise ((resolve , reject) =>{
         db.query(query ,[order.name, order.quantity,order.drug_id],(error , results , fields)=>{
              if(error) reject(error);
              else resolve(results)
         })
    })
}

UpdateDrugsQuery=(quantity, name) => {
        const query =  'update  drugs set quantity = quantity + ? where drug_name = ?';
    return new Promise ((resolve , reject) =>{
        db.query(query ,[quantity,name],(error , results , fields)=>{
             if(error) reject(error);
             else resolve(results);
        })
   })
}


UpdateCalcelationQuery=(quantity , name) => {
    const query =  'update  drugs set quantity = quantity - ? where drug_name = ?';
return new Promise ((resolve , reject) =>{
    db.query(query ,[quantity,name],(error , results , fields)=>{
         if(error) reject(error);
         else resolve(results);
    })
})
}


GetOrder = async (req , res) =>{
    const body = req.body;
    try {
    
        await GetOrderQuery(body);
        await UpdateDrugsQuery(body.quantity , body.name)
        res.send("You Ordered " + body.name + " quantity " + body.quantity).status(200);
    } catch (error) {
        res.send(error).status(500);
    }
}

CancelOrderQuery=(id) => {
    
    const query =  'select * from orders where order_id = ?';
return new Promise ((resolve , reject) =>{
    db.query(query ,[id],(error , results , fields)=>{
         if(error) reject(error);
         else resolve(results);
    })
})
}
DeleteOrderQuery=(id)=>{
    const query = 'DELETE FROM orders WHERE order_id= ?';
    return new Promise ((resolve , reject) =>{
        db.query(query ,[id],(error , results , fields)=>{
             if(error) reject(error);
             else resolve(results);
        })
    })
}

CancelOrder = async (req, res )=>{
    try {
       const result = await CancelOrderQuery(req.params.id);
       console.log(result);
        await UpdateCalcelationQuery(result[0].order_quantity ,result[0].type_of_drugs);
        await DeleteOrderQuery(req.params.id);
        res.send("order canceled").status(200);
    } catch (error) {
        res.send(error).status(500);
    }
}

GetAllOrdersQuery=() => {
    const query = 'select * from orders';
    return new Promise ((resolve , reject) =>{
        db.query(query ,(error , results , fields)=>{
             if(error) reject(error);
             else resolve(results);
        })
    })
}
GetAllOrders =async (req , res)=>{
    try {
        const orders = await GetAllOrdersQuery();
        res.send(orders).status(200);
     } catch (error) {
         res.send(error).status(500);
     }
}


module.exports = {
    GetOrder,
    CancelOrder ,
    GetAllOrders
}











