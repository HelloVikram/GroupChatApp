const endpoint = 'http://localhost:3000';
const groupList = document.getElementById('grouplist');
const messageContainer = document.getElementById('messageContainer');
const messageForm = document.getElementById('messageForm');
const groupform = document.getElementById('groupform');
let currentgroupId=null;
const displaygroupmessages = async (groupId) => {
    try {
        const token = localStorage.getItem('token');
        const result = await axios.get(`${endpoint}/getgroupmessages?groupId=${groupId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        messageContainer.innerHTML='';
        result.data.result.forEach(elem => {
          const div=document.createElement('div');
          div.className=`p-2 m-2 bg-light border`;
          div.innerHTML=`<strong>${elem.user.name}</strong>:${elem.chat}`;
          messageContainer.appendChild(div);
        })
        messageContainer.scrollTop=messageContainer.scrollHeight;
        console.log(result);
    } catch (err) {
        console.log('Error in getting group messages!', err);
    }
}
messageForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        try {
            if(!currentgroupId) return;
            const token = localStorage.getItem('token');
            const message = e.target.messageid.value;
            const result = await axios.post(`${endpoint}/groupmessages`, { message, groupId:currentgroupId }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            console.log('groupmessages', result);
            e.target.reset();
            displaygroupmessages(currentgroupId);
        } catch (err) {
            console.log('Error in sending msg to group!', err);
        }
    })
const selectgroup = (groupId) => {
    currentgroupId=groupId;
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
                li.className = `list-group-item  list-group-item-action`;
                li.textContent = group.group.name;
                li.onclick = () => {
                    currentgroupId=group.group.id;
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
        console.log(result);
        eve.target.reset();
    } catch (err) {
        console.log('Error in forming group!!', err);
    }
})

