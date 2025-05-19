const endpoint = 'http://localhost:3000';
const groupList = document.getElementById('grouplist');
const messageContainer = document.getElementById('messageContainer');
const messageForm = document.getElementById('messageForm');
const groupform = document.getElementById('groupform');
let currentgroupId = null;
//initialize socket connection
const socket=io(endpoint);
const username = localStorage.getItem('username') || 'Anonymous';

const displaygroupmessages = async (groupId) => {
    try {
        const token = localStorage.getItem('token');
        const result = await axios.get(`${endpoint}/getgroupmessages?groupId=${groupId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        messageContainer.innerHTML = '';
        result.data.result.forEach(elem => {
            const div = document.createElement('div');
            let newname=elem.user.name;
                if(localStorage.getItem('username')==newname){
                  newname='You';
                }
            div.className = `p-2 m-2 bg-light border`;
            div.innerHTML = `<strong>${newname}</strong>:${elem.chat}`;
            messageContainer.appendChild(div);
        })
        messageContainer.scrollTop = messageContainer.scrollHeight;
        console.log(result);
    } catch (err) {
        console.log('Error in getting group messages!', err);
    }
}

const promoteToAdmin = async (groupId, memberId) => {
    const token = localStorage.getItem('token');
    try {
        const result = await axios.post(`${endpoint}/promoteToAdmin`, { groupId, memberId }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        alert('Member Promoted to Admin');
        console.log('Member promoted to admin', result);
        openManageModal(groupId);
    } catch (err) {
        if (err.response) {
            if (err.response.status == 400 || err.response.status == 500) {
                alert(err.response.data.message);
            }
        }
        console.log('Error in promoting to Admin', err)
    }
};

const removeUser = async (groupId, memberId) => {
    const token = localStorage.getItem('token');
    try {
        const result = await axios.post(`${endpoint}/removeUser`, { groupId, memberId }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        alert('Member removed')
        console.log('Member removed', result);
        openManageModal(groupId);
    } catch (err) {
        if (err.response) {
            if (err.response.status == 400 || err.response.status == 403 || err.response.status == 500) {
                alert(err.response.data.message);
            }
        }
        console.log('Error in removing user', err)
    }
};


const removeAdmin = async (groupId, memberId) => {
    const token = localStorage.getItem('token');
    try {
        const result = await axios.post(`${endpoint}/removeAdmin`, { groupId, memberId }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        alert('Member removed from Admin');
        console.log('Member removed from Admin', result);
        openManageModal(groupId);
    } catch (err) {
        if (err.response) {
            if (err.response.status == 400 || err.response.status == 403 || err.response.status == 500) {
                alert(err.response.data.message);
            }
        }
        console.log('Error in removing user from admin', err)
    }
};

messageForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
        if (!currentgroupId) return;
        const token = localStorage.getItem('token');
        const message = e.target.messageid.value;
        const result = await axios.post(`${endpoint}/groupmessages`, { message, groupId: currentgroupId }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        //send messaged using socket after saved in db
        socket.emit('groupMessage',{
            groupId:currentgroupId,
            message:message,
            senderName:username
        })

        e.target.reset();
        //displaygroupmessages(currentgroupId);
    } catch (err) {
        console.log('Error in sending msg to group!', err);
    }
})
const selectgroup = (groupId) => {
    //Emit join room while selecting a group
    if(currentgroupId){
        socket.emit('leaveGroup',currentgroupId);
    }
    currentgroupId = groupId;
    socket.emit('joinGroup',currentgroupId)
    displaygroupmessages(groupId);
}
const addtogrouplist = async () => {
    try {
        const token = localStorage.getItem('token');
        const groupsadded = await axios.get(`${endpoint}/groupsadded`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        if (groupsadded.status == 200) {
            groupList.innerHTML = '';

            groupsadded.data.yourgroups.forEach(group => {
                const li = document.createElement('li');
                li.className = `list-group-item m-2 list-group-item-action`;
                li.textContent = group.group.name;
                const manageBtn = document.createElement('button');
                manageBtn.className = 'btn btn-sm btn-secondary float-end';
                manageBtn.textContent = 'Manage';
                manageBtn.onclick = (e) => {
                    e.stopPropagation(); // Prevent list item selection
                    openManageModal(group.group.id); // Open modal for this group
                };
                li.appendChild(manageBtn);

                li.onclick = () => {
                    currentgroupId = group.group.id;
                    document.querySelectorAll('.list-group-item').forEach(item => {
                        item.classList.remove('active');
                    });
                    li.classList.add('active');
                    selectgroup(currentgroupId);
                };

                groupList.appendChild(li);
            });
        }

    } catch (err) {
        console.log('Error in showing groups!', err);
    }

}
addtogrouplist();
groupform.addEventListener('submit', async (eve) => {
    eve.preventDefault();
    try {
        const token = localStorage.getItem('token');
        const groupName = eve.target.groupname.value;
        const users = eve.target.inviteUsers.value.split(',');
        console.log({ groupName, users })
        const result = await axios.post(`${endpoint}/creategroup`, { groupName, users }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        addtogrouplist();
        const groupModal = bootstrap.Modal.getInstance(document.getElementById('GroupModal'));
        if (groupModal) groupModal.hide();
        eve.target.reset();
    } catch (err) {
        console.log('Error in forming group!!', err);
    }
})
//real time listener for group messages
socket.emit('registerUser', username);

socket.on('groupMessage', (data) => {
    if (data.groupId === currentgroupId) {
        const div = document.createElement('div');
        div.className = `p-2 m-2 bg-light rounded`;
        let newname=data.senderName;
                if(localStorage.getItem('username')==newname){
                  newname='You';
                }
        div.innerHTML = `<strong>${newname}</strong>: ${data.message}`;
        messageContainer.appendChild(div);
        messageContainer.scrollTop = messageContainer.scrollHeight;
    }
});


socket.on('userConnected', (username) => {
  const pr = document.createElement('p');
  pr.className=`text-muted fst-italic small m-1`;
  pr.textContent = `${username} joined the chat.`; 
  messageContainer.appendChild(pr);
  messageContainer.scrollTop = messageContainer.scrollHeight;
});


socket.on('userDisconnected', (username) => {
  const pr = document.createElement('p');
  pr.className=`text-muted fst-italic small m-1`;
  pr.textContent = `${username} left the chat.`; 
  messageContainer.appendChild(pr);
  messageContainer.scrollTop = messageContainer.scrollHeight;
});

const openManageModal = async (groupId) => {
    try {
        const token = localStorage.getItem('token');
        const result = await axios.get(`${endpoint}/groupmembers?groupId=${groupId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const members = result.data.members;
        const membersList = document.getElementById('groupMembersList');
        membersList.innerHTML = '';

        members.forEach(member => {
            const li = document.createElement('li');
            li.className = 'list-group-item';

            const nameDiv = document.createElement('div');
            nameDiv.textContent = member.name;

            const btnContainer = document.createElement('div');
            btnContainer.style.marginTop = '5px';

            const promoteBtn = document.createElement('button');
            promoteBtn.className = 'btn btn-sm btn-primary me-2';
            promoteBtn.textContent = 'Make Admin';
            promoteBtn.onclick = () => promoteToAdmin(groupId, member.id);

            const removeBtn = document.createElement('button');
            removeBtn.className = 'btn btn-sm btn-danger';
            removeBtn.textContent = 'Remove';
            removeBtn.onclick = () => removeUser(groupId, member.id);

            btnContainer.appendChild(promoteBtn);
            btnContainer.appendChild(removeBtn);

            li.appendChild(nameDiv);
            li.appendChild(btnContainer);

            if (member.isAdmin) {
                const removeAdminBtn = document.createElement('button');
                removeAdminBtn.className = 'btn btn-sm btn-warning';
                removeAdminBtn.textContent = 'Remove Admin';
                removeAdminBtn.onclick = () => removeAdmin(groupId, member.id);
                li.appendChild(removeAdminBtn);
            }

            membersList.appendChild(li);
        });
        const addMembersBtn = document.getElementById('addMembersBtn');
        addMembersBtn.onclick = async () => {
            const token = localStorage.getItem('token');
            const addinput = document.getElementById('addMembersInput');
            const emails=addinput.value.split(',').map(e => e.trim());
            try {
                const res = await axios.post(`${endpoint}/addMembers`, { groupId, users: emails }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                alert('Members added!');
                addinput.value='';
                openManageModal(groupId);
            } catch (err) {
                alert('Error adding members');
                console.log(err);
            }
        };
        // Show modal
        const myModal = new bootstrap.Modal(document.getElementById('ManageGroupModal'));
        myModal.show();
    } catch (err) {
        console.log('Error in fetching group members!', err);
    }
};
