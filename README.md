
###Добавление контакта
POST /contacts<br/>
name={name}&lastname={lastname}&phone={phone}&info[email]={email}&info[skype]={skype}
* name - обязательное, строка
* lastname - обязательное, строка
* phone - обязательное, только цифры
* info[...] - не обязательное

###Редактирование контакта
PUT /contacts/{id}<br/>
name={name}&lastname={lastname}&phone={phone}&info[email]={email}&info[skype]={skype}
* name - обязательное, строка
* lastname - обязательное, строка
* phone - обязательное, только цифры
* info[...] - не обязательное

###Удаление контакта
DELETE /contacts/{id}

###Список контактов
GET /contacts/?name={name}&lastname={lastname}&phone={phone}<br/>
Результат - список контактов, отфильтрованных по параметрам. Параметры name, lastname, phone не обязательны. 

###Полная информация о контакте
GET /contacts/{id}