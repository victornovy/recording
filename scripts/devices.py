import sounddevice as sd

devices = sd.query_devices()
i = 0
formatDevices = '['

for device in devices:
  formatDevices += '{ "id": "' + str(i) + '" , "name": "' + device['name'] + '" },'
  i += 1

formatDevices = formatDevices[:-1]
formatDevices += ']'

print formatDevices