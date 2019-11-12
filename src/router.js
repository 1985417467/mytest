export default{
    mode:'history',
    routes:[
        {
            path:'/login',
            name:"login",
            component:()=> import('./vue/login')
        },
        {
            path:'/layout',
            meta:{needAuth:true},
            beforeEnter:function(to,from,next){
              var arr,reg=new RegExp("(^|)"+'node_auth'+"=([^;]*)(;|$)");
              arr=document.cookie.match(reg);
              if(arr?unescape(arr[2]):null){
                  next()
              }
              else{
                  next({path:'./login',query:{returnUrl:to.fullPath}});
              }
                
            },
            name:"layout",
            component:()=> import('./vue/layout'),
            children:[
                {
                    path:'user',
                    name:"user",
                    component:()=> import('./vue/user'),
                },
                {
                    path:'order',
                    name:"order",
                    component:()=> import('./vue/order'),
                },
                {
                    path:'category',
                    name:"category",
                    component:()=> import('./vue/category'),
                },
                {
                    path:'map',
                    name:"map",
                    component:()=> import('./vue/map'),
                },
                {
                    path:'ticket',
                    name:"ticket",
                    component:()=> import('./vue/ticket'),
                },
                {
                    path:'admin',
                    name:"admin",
                    component:()=> import('./vue/admin'),
                }
            ]

        }
    ]
}