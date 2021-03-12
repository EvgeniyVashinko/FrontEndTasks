using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace ChatApp
{
    class Program
    {
        static Socket _listeningSocket;
        static EndPoint _remotePoint;
        static readonly List<Message> _messages = new();
        static User _user;
        static State _state = State.Disconnected;

        static void Main(string[] args)
        {
            Console.Write("Enter your port: ");
            var localPort = int.Parse(Console.ReadLine());

            Console.Write("Enter your friend's port: ");
            var remotePort = int.Parse(Console.ReadLine());
            _user = new(localPort, remotePort);

            Console.WriteLine("Wait for your friend");

            _remotePoint = new IPEndPoint(IPAddress.Parse("127.0.0.1"), _user.RemotePort);

            _listeningSocket = new Socket(AddressFamily.InterNetwork, SocketType.Dgram, ProtocolType.Udp);
            _listeningSocket.Bind(new IPEndPoint(IPAddress.Parse("127.0.0.1"), _user.LocalPort));
            try
            {
                Task.Factory.StartNew(CheckMessages);
                Task.Factory.StartNew(SendEmptyString);

                while (true)
                {
                    var message = new Message(_user.Id, Console.ReadLine());
                    AddMessage(message);
                    Send(message.ToString());
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
        }

        public static void Listen()
        {
            try
            {
                while (true)
                {
                    var builder = new StringBuilder();
                    var data = new byte[256];
                    EndPoint remoteIp = new IPEndPoint(IPAddress.Any, _user.RemotePort);
                    do
                    {
                        var bytes = _listeningSocket.ReceiveFrom(data, ref remoteIp);
                        builder.Append(Encoding.Unicode.GetString(data, 0, bytes));
                    }
                    while (_listeningSocket.Available > 0);

                    if (_state == State.Disconnected)
                    {
                        _state = State.Connected;
                        SendMessages();
                        Console.WriteLine("Your friend in the chat");
                    }

                    var remoteFullIp = remoteIp as IPEndPoint;
                    if (builder.ToString() != string.Empty && remoteFullIp?.Port == _user.RemotePort)
                    {
                        AddMessage(new(builder.ToString()));
                        Console.WriteLine(builder.ToString());
                    }
                }
            }
            catch (Exception)
            {
                if (_state is State.Connected)
                {
                    Console.WriteLine("Your friend has left the chat");
                }

                _state = State.Disconnected;         
            }
        }

        public static void CheckMessages()
        {
            while (true)
            {
                Listen();
            }
        }

        public static void SendEmptyString()
        {
            while (true)
            {
                Send(string.Empty);
                Thread.Sleep(100);
            }
        }

        public static void SendMessages()
        {
            foreach (var item in _messages)
            {
                Send(item.ToString() + Environment.NewLine);
            }
        }

        public static void AddMessage(Message message) => _messages.Add(message);

        public static void Send(string message)
        {
            var data = Encoding.Unicode.GetBytes(message);
            _listeningSocket.SendTo(data, _remotePoint);
        }
    }
}
