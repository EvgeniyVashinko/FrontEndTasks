using System;

namespace ChatApp
{
    public class Message
    {
        public Guid UserId { get; init; }
        public string Content { get; init; }

        public Message(Guid userId, string content) => (UserId, Content) = (userId, content);

        public Message(string content)
        {
            var data = content.Split(':', StringSplitOptions.TrimEntries | StringSplitOptions.RemoveEmptyEntries);
            (UserId, Content) = (new Guid(data[0]), string.Concat(data[1..]));
        }

        public override string ToString() => $"{UserId}: {Content}";
    }

}
