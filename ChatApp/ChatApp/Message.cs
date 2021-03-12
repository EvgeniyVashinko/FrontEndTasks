using System;

namespace ChatApp
{
    public class Message
    {
        public Guid UserId { get; init; }
        public Guid FriendId { get; init; }
        public string Content { get; init; }

        public Message(Guid userId, string content) => (UserId, Content, FriendId) = (userId, content, Guid.Empty);

        public Message(Guid userId, string content, Guid friendId) => (UserId, Content, FriendId) = (userId, content, friendId);

        public Message(string content)
        {
            var data = content.Split(':', StringSplitOptions.TrimEntries | StringSplitOptions.RemoveEmptyEntries);
            (UserId, FriendId, Content) = (new Guid(data[0]), new Guid(data[1]), string.Concat(data[2..]));
        }

        public override string ToString() => $"{UserId}:{FriendId}: {Content}";

        public string GetMessage() => $"{UserId}: {Content}";
    }

}
