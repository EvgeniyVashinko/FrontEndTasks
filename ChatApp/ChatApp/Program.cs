using System;
using System.Collections.Generic;
using System.Linq;
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
        static Guid _friendId = Guid.Empty;

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
                Task.Factory.StartNew(SendEmptyMessage);

                while (true)
                {
                    var message = new Message(_user.Id, Console.ReadLine(), _friendId);
                    AddMessage(message);
                    if (_friendId == Guid.Empty)
                    {
                        Console.WriteLine("Message not sent, your friend is offline");
                    }
                    else
                    {
                        Send(message.ToString());
                    }
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
                        var message = new Message(builder.ToString());
                        _friendId = message.UserId;
                        _state = State.Connected;
                        SendMessages();
                        Console.WriteLine("Your friend in the chat");
                    }

                    var remoteFullIp = remoteIp as IPEndPoint;
                    var mes = new Message(builder.ToString());
                    if (mes.Content.ToString() != string.Empty && remoteFullIp?.Port == _user.RemotePort)
                    {
                        AddMessage(mes);
                        Console.WriteLine(mes.GetMessage());
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

        public static void SendEmptyMessage()
        {
            while (true)
            {
                var mes = new Message(_user.Id, string.Empty);
                Send(mes.ToString());
                Thread.Sleep(100);
            }
        }

        public static void SendMessages()
        {
            foreach (var item in _messages.Where(o => (o.UserId == _user.Id || o.UserId == _friendId) && (o.FriendId == _user.Id || o.FriendId == _friendId)))
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
