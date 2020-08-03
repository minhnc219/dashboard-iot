using Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace WebApi.Services
{
    public class TimerManager
    {
        private Action action;
        public TimerManager(Action action, int index)
        {
            this.action = action;
            GroupAndTimer.groupAndTimers[index].Timer = new Timer(Execute, null, 0, 5000);

        }
        public void Execute(object stateInfo)
        {
            this.action();
        }
    }
}
