
const router=require("../route/ticket.js")
it("get open ticket",() => {
    const request= router.get("closed/:busId")
    const response=  router.get("ticktes") 
    expect(request).toBe(response);
});