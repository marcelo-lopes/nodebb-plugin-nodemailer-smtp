<h1><i class="fa fa-envelope-o"></i> Nodemailer SMTP</h1>

<div class="row">
  <div class="col-lg-12">
    <blockquote>
      Plugin for NodeBB allowing you to send e-mail via SMTP using <b>LATEST</b> Nodemailer.
    </blockquote>
  </div>
</div>

<hr />

<form role="form" class="nodemailer-smtp-settings">
  <fieldset>
    <div class="row">
      <div class="col-sm-12">
        <div class="form-group">
          <label for="nodemailer:smtp:host">Host</label>
          <input type="text" class="form-control" id="nodemailer:smtp:host" name="nodemailer:smtp:host" />
        </div>
      </div>
      <div class="col-sm-12">
        <div class="form-group">
          <label for="nodemailer:smtp:port">Port</label>
          <input type="text" class="form-control" value="25" id="nodemailer:smtp:port" name="nodemailer:smtp:port" />
        </div>
      </div>
      <div class="col-sm-12">
        <div class="form-group">
          <label for="nodemailer:smtp:username">User</label>
          <input type="text" class="form-control" id="nodemailer:smtp:username" name="nodemailer:smtp:username" />
        </div>
      </div>
      <div class="col-sm-12">
        <div class="form-group">
          <label for="nodemailer:smtp:password">Password</label>
          <input type="password" class="form-control" id="nodemailer:smtp:password" name="nodemailer:smtp:password" />
        </div>
      </div>
      <div class="col-sm-12">
        <div class="form-group">
          <label>
            <input type="checkbox" id="nodemailer:smtp:secure" name="nodemailer:smtp:secure"/>
             Enable secure connection
          </label>
        </div>
      </div>
      <div class="col-sm-12">
        <div class="form-group">
          <label>
            <input type="checkbox" id="nodemailer:smtp:tls" name="nodemailer:smtp:tls"/>
             Enable TLS connection
          </label>
        </div>
      </div>
    </div>

    <button class="btn btn-lg btn-primary" id="save">Save</button>
  </fieldset>
</form>

<script type="text/javascript">
  require(['settings'], function(Settings) {
    Settings.load('nodemailer-smtp', $('.nodemailer-smtp-settings'));
    $('#save').on('click', function() {
      Settings.save('nodemailer-smtp', $('.nodemailer-smtp-settings'), function() {
        app.alert({
          alert_id: 'nodemailer-smtp',
          type: 'info',
          title: 'Settings Changed',
          message: 'Please reload your NodeBB to apply these changes',
          timeout: 5000,
          clickfn: function() {
            socket.emit('admin.reload');
          }
        });
      });
    });
  });
</script>