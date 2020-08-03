using System;

namespace MqttServer
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("List feature that you can use");
            Console.WriteLine("1. Start Server");
            Console.WriteLine("2. Stop Server");
            Console.WriteLine("3. Exit");
            string choose = "";
            MqttServer server = new MqttServer();
            do
            {
                Console.WriteLine("Choose feature: ");
                choose = Console.ReadLine();
                switch (choose)
                {
                    case "1": server.StartServer(); break;
                    case "2": server.StopServer(); break;
                }
            } while (choose != "3");
        }
    }
}
