import axios from "axios";
import moment from "moment";
import { useState, useEffect } from "react";
import { useUser } from "./useUser";
import { CATEGORIES } from '../util';

export const useActivity = () => {
  const { user } = useUser();
  const [activity, setActivity] = useState([]);

  const filterActivity = (category,time) => {
    const activitybycategory = category === '' ? activity : 
    activity.filter((element) => category === element.category);
    
    const filteredactivity = time === '' ? activitybycategory : 
    time === 'week' ? activitybycategory.filter(
      (element) => {
        const start = moment().clone().startOf('week') 
        const end = moment().clone().endOf('week') 
        return moment(element.createdAt).isBetween(start,end)
      }
    ) : time=== 'month' ? activitybycategory.filter(
      (element) =>
        moment().format("MM-YYYY") ===
        moment(element.createdAt).format("MM-YYYY")
    ) : activitybycategory.filter(
      (element) =>
        moment(time,"YYYY-MM-DD").format("DD-MM-YYYY") ===
        moment(element.createdAt).format("DD-MM-YYYY")
    );
    
    return filteredactivity;
  }

  const calcExpense=(category,time)=>{
    let expense=0,income=0;
    filterActivity(category,time).forEach(ele =>       
       ele.status==='-' ? expense += ele.amount : income += ele.amount
    )
    
    return {expense,income}
  }
  const top3=(time)=>{
    const sortbyExpense = (a,b) => {
      if(a.expense > b.expense)
          return -1;
      else if(a.expense === b.expense)
          return 0;
      else return 1;
    }
    const summary=getCategorySummary(time);
    const top=summary.sort(sortbyExpense).slice(0,3)
    return top;
  }
  const getMonthSummary = (category,time) => {
    const summary = [];
    const suffix =  moment(time).format('YYYY-MM-');
    for(let i=1; i <= moment(time).daysInMonth();i++){
      const {expense,income} = calcExpense(category,suffix+i)
      summary.push({
        day: suffix + i,
        expense: expense,
        income: income
      })
    }
    return summary
  }

    const getWeekSummary = (category) => {
      const start = moment().clone().startOf('week').format('D')
      const end = moment().clone().endOf('week').format('D')
      const summary = [];
      const suffix =  moment().format('YYYY-MM-');
      for(let i= start; i <= end;i++){
        const {expense,income} = calcExpense(category,suffix+i)
        summary.push({
          day: suffix + i,
          expense: expense,
          income: income
        })
      }
    //console.log(summary)
    return summary;
    }
 
  const getCategorySummary = (time) => {
    let summary = [];
    for(let category of CATEGORIES){
      const {expense,income} = calcExpense(category,time)
      summary.push({
        name: category,
        expense: expense,
        income: income
      })
    }
    return summary;
  }

  useEffect(() => {
    axios
      .get("/api/getactivity", {
        params: {
          user,
        },
      })
      .then((res) => {
        setActivity(res.data);
      });
  }, [user]);

  return { getCategorySummary, getMonthSummary, getWeekSummary , calcExpense, filterActivity,top3 };
};
