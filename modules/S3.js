import Storage from './Storage';

const S3 = {
    uploadRecording: async function (item) {
        var response;
        try {
            var apiEndpoint = 'https://c45sfncg84.execute-api.eu-west-1.amazonaws.com/premier-test/presigned-url-for-upload';
            response = (await fetch(apiEndpoint, { method: 'POST', body: JSON.stringify(item) }));
            var body = await response.json()
            if (response.status != 200)
                return (body)
        } catch (error) {
            console.error(error);
            return
        }

        var presigned_url = body.url
        var fields = body.fields
        var fd = new FormData

        for (var key in fields) {
            fd.append(key, fields[key])
        }
        fd.append('file', { uri: item.uri })

        var options = {
            method: 'POST',
            body: fd,
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }
        try {
            response = await fetch(presigned_url, options)
        } catch (error) {
            console.log(error)
            return false
        }
        item.sent = true
        Storage.setItem(item.id, 'sent', true)
        return response.ok
    },
    pullMinutes: async function (minutesArray) {
        var response;
        try {
            var apiEndpoint = 'https://c45sfncg84.execute-api.eu-west-1.amazonaws.com/premier-test/refresh-client';
            response = (await fetch(apiEndpoint, { method: 'POST', body: minutesArray.join() }));
            var data = await response.json()
            if (response.status != 200)
                return (data)
        } catch (error) {
            console.error(error);
            return
        }
        if (!data)
            return (false)
        for (const min of minutesArray) {
            if (min in data) {
                Storage.setItem(min, 'transcription', data[min])
                Storage.setItem(min, 'sent', false)
            }
        }
        return (true)
    }
}

export default S3;