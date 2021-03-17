using System;

namespace ChatApp
{
    public record User(Guid Id, int LocalPort, int RemotePort)
    {
        public User(int localPort, int remotePort) : this(Guid.NewGuid(), localPort, remotePort) { }
    }
}
